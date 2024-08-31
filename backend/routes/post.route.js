import express from "express";
import { isAuthonticated } from "../middlewares/isAuthonticated.js";
import {
  bookmarkPost,
  commentPost,
  deleteComment,
  deletePost,
  disLikePost,
  getAllPost,
  getUserPost,
  likePost,
  uploadPost,
} from "../controllers/post.controller.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router
  .route("/addpost")
  .post(isAuthonticated, upload.single("image"), uploadPost);
router.route("/all").get(isAuthonticated, getAllPost);
router.route("/userpost/all").post(isAuthonticated, getUserPost);
router.route("/:id/like").get(isAuthonticated, likePost);
router.route("/:id/dislike").get(isAuthonticated, disLikePost);
router.route("/:id/comment").post(isAuthonticated, commentPost);
router
  .route("/:postId/comment/:commentId")
  .delete(isAuthonticated, deleteComment);
router.route("/delete/:id").delete(isAuthonticated, deletePost);
router.route("/:id/bookmark").post(isAuthonticated, bookmarkPost);

export default router;
