import express from "express";
import {
  editProfile,
  followOrUnfollow,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import { isAuthonticated } from "../middlewares/isAuthonticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/:id/profile").get(isAuthonticated, getProfile);
router
  .route("/profile/edit")
  .post(isAuthonticated, upload.single("profilePicture"), editProfile);
router.route("/suggestedusers").get(isAuthonticated, getSuggestedUsers);
router.route("/followorunfollow/:id").post(isAuthonticated, followOrUnfollow);

export default router;
