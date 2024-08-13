import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: mongoose.Types.ObjectId,
    ref: "Message",
  },
});

export const Conversation = mongoose.Schema("Conversation", conversationSchema);
