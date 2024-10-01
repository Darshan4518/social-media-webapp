import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUriParser.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/posts.model.js";
import redisClient from "../utils/redisClient.js";

import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(401).json({ message: "please fill the register form" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const existingUsername = await User.findOne({ userName });
    if (existingUsername) {
      return res.status(401).json({ message: "Username already taken" });
    }

    const user = await User.create({
      userName,
      email,
      password: hashPassword,
    });

    await redisClient.del("users:suggested");
    await redisClient.del(`user:${email}`);

    return res.status(201).json({ message: "Account successfully created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ msg: "Please fill the login form" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Password does not match" });
    }

    const cachedUser = await redisClient.get(`user:${email}`);
    if (cachedUser) {
      user = JSON.parse(cachedUser);
    } else {
      const populatePosts = await Promise.all(
        (user?.posts || []).map(async (postId) => {
          const post = await Post.findById(postId);
          if (post?.author?.equals(user._id)) {
            return post;
          }
          return null;
        })
      );

      user = {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        posts: populatePosts,
      };

      await redisClient.setEx(`user:${email}`, 60 * 60, JSON.stringify(user));
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Logged in successfully", user, success: true, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const redisKey = `user:${userId}:profile`;

    const cachedUserProfile = await redisClient.get(redisKey);
    if (cachedUserProfile) {
      return res.status(200).json({ user: JSON.parse(cachedUserProfile) });
    }

    const user = await User.findById(userId)
      .populate({ path: "posts", sort: { createdAt: -1 } })
      .populate("bookmarks");

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    await redisClient.setEx(redisKey, 60 * 60, JSON.stringify(user));

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSearchUsers = async (req, res) => {
  try {
    const name = req.query.name;
    const redisKey = `search:users:${name}`;

    const cachedUsers = await redisClient.get(redisKey);
    if (cachedUsers) {
      return res
        .status(200)
        .json({ success: true, users: JSON.parse(cachedUsers) });
    }

    const users = await User.find({
      userName: { $regex: name, $options: "i" },
    });

    if (!users || users.length === 0) {
      return res.status(400).json({ message: "No users found" });
    }

    const filteredUsers = users.filter(
      (user) => user._id.toString() !== req.id
    );

    await redisClient.setEx(redisKey, 60 * 60, JSON.stringify(filteredUsers));

    return res.status(200).json({ success: true, users: filteredUsers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudinaryResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudinaryResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudinaryResponse.secure_url;

    await user.save();

    await redisClient.del(`user:${userId}`);
    await redisClient.del(`user:${user.email}`);

    return res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getSuggestedUsers = async (req, res) => {
  try {
    const redisKey = `users:suggested`;

    const cachedSuggestedUsers = await redisClient.get(redisKey);
    if (cachedSuggestedUsers) {
      return res.status(200).json({ users: JSON.parse(cachedSuggestedUsers) });
    }

    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );

    if (!suggestedUsers) {
      return res.status(402).json({ message: "No users found" });
    }

    await redisClient.setEx(redisKey, 60 * 60, JSON.stringify(suggestedUsers));

    return res.status(200).json({ users: suggestedUsers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const followOrUnfollow = async (req, res) => {
  try {
    const currentUserId = req.id;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot follow yourself" });
    }

    const currentUser = await User.findById(currentUserId).select("-password");
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      await Promise.all([
        User.updateOne(
          { _id: currentUserId },
          { $pull: { following: targetUserId } }
        ),
        User.updateOne(
          { _id: targetUserId },
          { $pull: { followers: currentUserId } }
        ),
      ]);
    } else {
      await Promise.all([
        User.updateOne(
          { _id: currentUserId },
          { $push: { following: targetUserId } }
        ),
        User.updateOne(
          { _id: targetUserId },
          { $push: { followers: currentUserId } }
        ),
      ]);
    }

    await Promise.all([currentUser.save(), targetUser.save()]);

    // Invalidate caches
    await redisClient.del(`user:${currentUserId}`);
    await redisClient.del(`user:${targetUserId}`);
    await redisClient.del(`users:suggested`);

    return res.status(200).json({
      success: true,
      action: isFollowing ? "unfollow" : "follow",
      message: isFollowing
        ? "Unfollowed successfully"
        : "Followed successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    return res
      .cookie("token", "", { maxAge: 0 })
      .json({ massage: "Logout successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};
