import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import redisClient from "../utils/redisClient.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ success: false, message: "Invalid IDs" });
    }
    if (
      !mongoose.isValidObjectId(senderId) ||
      !mongoose.isValidObjectId(receiverId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ObjectId" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) conversation.messages.push(newMessage._id);

    await Promise.all([conversation.save(), newMessage.save()]);

    await redisClient.set(
      `message:${newMessage._id}`,
      JSON.stringify(newMessage),
      {
        EX: 3600,
      }
    );

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(200).json({ success: true, newMessage });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send message" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const redisKey = `conversation:${senderId}:${receiverId}`;

    const cachedMessages = await redisClient.get(redisKey);
    if (cachedMessages) {
      return res
        .status(200)
        .json({ success: true, messages: JSON.parse(cachedMessages) });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({ success: true, messages: [] });
    }

    await redisClient.set(redisKey, JSON.stringify(conversation.messages), {
      EX: 3600,
    });

    return res
      .status(200)
      .json({ success: true, messages: conversation.messages });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to get messages" });
  }
};
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.id;

    const message = await Message.findById(messageId);

    if (
      !message ||
      (message.senderId.toString() !== userId &&
        message.receiverId.toString() !== userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this message",
      });
    }

    await Conversation.updateOne(
      { messages: messageId },
      { $pull: { messages: messageId } }
    );

    await message.deleteOne();

    await redisClient.del(`message:${messageId}`);

    const receiverSocketId = getReceiverSocketId(message.receiverId);
    const senderSocketId = getReceiverSocketId(message.senderId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("deleteMessage", messageId);
    }
    if (senderSocketId && senderSocketId !== receiverSocketId) {
      io.to(senderSocketId).emit("deleteMessage", messageId);
    }

    return res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete message" });
  }
};
