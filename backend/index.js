import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/db.js";
import { config } from "dotenv";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socketIo.js";

// Load environment variables
config({});

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
  origin: ["https://social-media-webapp-bay.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Preflight requests (for HTTP methods like PUT, DELETE, etc.)
app.options("*", cors(corsOptions));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// Connect to the database
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT);

// Basic error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Something went wrong!" });
});
