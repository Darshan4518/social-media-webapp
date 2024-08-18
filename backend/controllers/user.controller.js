import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUriParser.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/posts.model.js";
export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(401).json({ message: "please fill the register form" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({ message: "User already Exist" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const existUsername = await User.findOne({ userName });

    if (existUsername) {
      return res.status(401).json({ message: "user_name already taken" });
    }

    const users = User.create({
      userName,
      email,
      password: hashPassword,
    });
    return res.status(201).json({ message: "Account Successfully Created.." });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ msg: "please fill the register form" });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: " Password doesn't Match" });
    }

    // populate the user posts

    const populatePosts = await Promise.all([
      user?.posts?.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post?.author?.equals(user._id)) {
          return post;
        }
        return null;
      }),
    ]);

    user = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      password: user.password,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatePosts,
    };

    const token = await jwt.sign(
      { userId: user._id },
      "jfdkusdhlfiuserytghfiurehg",
      { expiresIn: "1d" }
    );
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Logined successfully", user });
  } catch (error) {
    console.log(error);
  }
};

export const logout = (req, res) => {
  try {
    return res
      .cookie("token", "", { maxAge: 0 })
      .json({ massage: "Logout successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate({
        path: "posts",
        createdAt: -1,
      })
      .populate("bookmarks");
    if (!user) {
      res.status(400).json({ message: "user not exist" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
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

    return res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
    "-password"
  );
  if (!suggestedUsers) {
    return res.status(402).json({ massage: "user not found" });
  }
  return res.status(200).json({ users: suggestedUsers });
};

export const followOrUnfollow = async (req, res) => {
  const currentUserId = req.id;
  const targetUserId = req.params.id;
  if (currentUserId === targetUserId) {
    return res.status(402).json({ followBtn: false });
  }
  const user = await User.findById(currentUserId).select("-password");
  const targetUser = await User.findById(targetUserId);
  if (!user || !targetUser) {
    return res.status(402).json({ message: "user not found" });
  }
  const isFollowing = user.following.includes(targetUserId);
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
    return res.status(200).json({ message: "Unfllowed" });
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
    return res.status(200).json({ message: "Following" });
  }
};
