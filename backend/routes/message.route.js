import express from "express";
import { isAuthonticated } from "../middlewares/isAuthonticated.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.route("/send/:id").post(isAuthonticated, sendMessage);
router.route("/all/:id").get(isAuthonticated, getMessages);

export default router;
