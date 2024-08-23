import express from "express";
import { isAuthonticated } from "../middlewares/isAuthonticated.js";
import {
  getMessages,
  sendMessage,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.route("/send/:id").post(isAuthonticated, sendMessage);
router.route("/all/:id").get(isAuthonticated, getMessages);
router.route("/delete/:messageId").delete(isAuthonticated, deleteMessage);

export default router;
