import express from "express";
import { Server } from "socket.io";
import http from "http";
import redisClient from "../utils/redisClient.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5174", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

const updateOnlineUsers = async () => {
  try {
    const keys = await redisClient.keys("*");
    io.emit("getOnlineUser", keys);
  } catch (err) {
    console.error("Error fetching online users from Redis:", err);
  }
};

export const getReceiverSocketId = async (receiverId) => {
  try {
    return await redisClient.get(receiverId);
  } catch (err) {
    console.error("Error fetching receiver socket ID from Redis:", err);
  }
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    redisClient.set(userId, socket.id, (err) => {
      if (err) {
        console.error("Error setting user socket ID in Redis:", err);
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
            console.error("Error deleting user socket ID from Redis:", err);
          }
          updateOnlineUsers();
        });
      }
    }
  });
});

export { app, server, io };
