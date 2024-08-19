import express from "express"; // Fixed typo
import { Server } from "socket.io";
import http from "http";

const app = express(); // Fixed typo

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["POST", "GET"],
    credentials: true,
  },
});

const userSocketMap = {};

// Helper function to get receiver's socket ID
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("User connected: userId=", userId, "socketId=", socket.id);

    // Emit the updated list of online users
    io.emit("getOnlineUser", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      console.log("User disconnected: userId=", userId, "socketId=", socket.id);

      // Emit the updated list of online users
      io.emit("getOnlineUser", Object.keys(userSocketMap));
    }
  });
});

// Export the app, server, and io instance
export { app, server, io };
