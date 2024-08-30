import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = socket.id;
      console.log("User connected: userId=", userId, "socketId=", socket.id);

      io.emit("getOnlineUser", Object.keys(userSocketMap));
    } else {
      console.log("User already connected: userId=", userId);
    }
  }

  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId] === socket.id) {
      console.log("User disconnected: userId=", userId, "socketId=", socket.id);
      delete userSocketMap[userId];

      io.emit("getOnlineUser", Object.keys(userSocketMap));
    }
  });
});

export { app, server, io };
