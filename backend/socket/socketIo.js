import express from "express";
import { Server } from "socket.io";
import http from "http";
import redisClient from "../utils/redisClient.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://social-media-webapp-bay.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

const updateOnlineUsers = async () => {
  try {
    const keys = await redisClient.keys("*");
    io.emit("getOnlineUser", keys);
  } catch (err) {
    return;
  }
};

export const getReceiverSocketId = async (receiverId) => {
  try {
    return await redisClient.get(receiverId);
  } catch (err) {
    return;
  }
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    redisClient.set(userId, socket.id, (err) => {
      if (err) {
        return;
      }
    });
    updateOnlineUsers();
  }

  socket.on("disconnect", async () => {
    if (userId) {
      const socketId = await redisClient.get(userId);
      if (socketId === socket.id) {
        redisClient.del(userId, (err) => {
          if (err) {
            return;
          }
          updateOnlineUsers();
        });
      }
    }
  });
});

export { app, server, io };
