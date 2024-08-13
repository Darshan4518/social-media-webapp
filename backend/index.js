import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/db.js";
import { configDotenv } from "dotenv";
import userRoute from "../backend/routes/user.route.js";
const app = express();

// middleware

configDotenv();
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use("/api/v1/user", userRoute);
connectDB();
app.listen(5000, () => {
  console.log("server connected");
});
