import express from "express";
import { isAuthonticated } from "../middlewares/isAuthonticated.js";
import {
  bookmarkPost,
  commentPost,
  deletePost,
  disLikePost,
  getAllPost,
  getCommentOfPost,
  getUserPost,
  likePost,
  uploadPost,
} from "../controllers/post.controller.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router
  .route("/addpost")
  .post(isAuthonticated, upload.single("post"), uploadPost);
router.route("/all").get(isAuthonticated, getAllPost);
router.route("/userpost/all").post(isAuthonticated, getUserPost);
router.route("/:id/like").get(isAuthonticated, likePost);
router.route("/:id/dislike").get(isAuthonticated, disLikePost);
router.route("/:id/commnent").post(isAuthonticated, commentPost);
router.route("/:id/commnents").get(isAuthonticated, getCommentOfPost);
router.route("/delete/:id").post(isAuthonticated, deletePost);
router.route("/:id/bookmark").post(isAuthonticated, bookmarkPost);

export default router;
