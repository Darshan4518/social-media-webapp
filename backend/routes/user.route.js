import express from "express";
import {
  editProfile,
  followOrUnfollow,
  getProfile,
  getSearchUsers,
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
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthonticated, getProfile);
router
  .route("/profile/edit")
  .put(isAuthonticated, upload.single("profilePicture"), editProfile);
router.route("/suggestedusers").get(isAuthonticated, getSuggestedUsers);
router.route("/followorunfollow/:id").post(isAuthonticated, followOrUnfollow);
router.route("/getsearchusers").get(isAuthonticated, getSearchUsers);

export default router;
