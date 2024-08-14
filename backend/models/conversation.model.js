import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
  ],
});

export const Conversation = mongoose.model("Conversation", conversationSchema);
