import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/posts.model.js";
import { User } from "../models/user.model.js";
import redisClient from "../utils/redisClient.js";
import { getReceiverSocketId, io } from "../socket/socketIo.js";
import { Comment } from "../models/comment.model.js";

export const uploadPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;

    if (!image) {
      return res.status(400).json({ message: "Image required" });
    }

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({
        width: 800,
        height: 800,
        fit: "inside",
      })
      .toFormat("jpeg", { quality: 90 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;

    const cloudinaryResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudinaryResponse.secure_url,
      author: req.id,
    });

    const user = await User.findById(req.id);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    // Invalidate cache
    await redisClient.del("posts:all");
    await redisClient.del(`user:${req.id}:posts:page:1`);

    return res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllPost = async (req, res) => {
  try {
    const redisKey = "posts:all";

    const cachedPosts = await redisClient.get(redisKey);
    if (cachedPosts) {
      return res.status(200).json({
        message: "Received cached posts",
        posts: JSON.parse(cachedPosts),
      });
    }

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "profilePicture userName" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "profilePicture userName" },
      });

    const response = {
      message: "Received all posts",
      posts,
    };

    await redisClient.setEx(redisKey, 60, JSON.stringify(response));

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const authorId = req.id;
    const redisKey = `user:${authorId}:posts:page:${page}`;

    const cachedUserPosts = await redisClient.get(redisKey);
    if (cachedUserPosts) {
      return res.status(200).json({
        message: "Received cached user posts",
        posts: JSON.parse(cachedUserPosts),
      });
    }

    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "author", select: "profilePicture userName" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "profilePicture userName" },
      });

    const totalPosts = await Post.countDocuments({ author: authorId });
    const totalPages = Math.ceil(totalPosts / limit);

    const response = {
      message: "Received user posts",
      posts,
      pagination: {
        totalPosts,
        totalPages,
        currentPage: page,
        postsPerPage: limit,
      },
    };

    await redisClient.setEx(redisKey, 60, JSON.stringify(response));

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const likePost = async (req, res) => {
  try {
    const likedUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    await post.updateOne({ $addToSet: { likes: likedUserId } });
    await post.save();

    const user = await User.findById(likedUserId).select(
      "userName profilePicture"
    );

    const postOwerId = post?.author?.toString();

    if (postOwerId !== likedUserId) {
      const notification = {
        type: "like",
        userId: likedUserId,
        userDetails: user,
        postId,
        post,
      };
      const postOwerSocketId = getReceiverSocketId(postOwerId);
      io.to(postOwerSocketId).emit("notification", notification);
    }

    await redisClient.del(`posts:all`);
    await redisClient.del(`user:${postOwerId}:posts:page:1`);

    return res.status(201).json({ message: "Liked post" });
  } catch (error) {
    console.log(error);
  }
};

export const disLikePost = async (req, res) => {
  try {
    const disLikedUserId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    await post.updateOne({ $pull: { likes: disLikedUserId } });
    await post.save();

    const user = await User.findById(disLikedUserId).select(
      "userName profilePicture"
    );

    const postOwerId = post?.author?.toString();

    if (postOwerId !== disLikedUserId) {
      const notification = {
        type: "dislike",
        userId: disLikedUserId,
        userDetails: user,
        postId,
      };
      const postOwerSocketId = getReceiverSocketId(postOwerId);
      io.to(postOwerSocketId).emit("notification", notification);
    }

    await redisClient.del(`posts:all`);
    await redisClient.del(`user:${postOwerId}:posts:page:1`);

    return res.status(201).json({ message: "Disliked post" });
  } catch (error) {
    console.log(error);
  }
};
export const commentPost = async (req, res) => {
  try {
    const commentedUserId = req.id;
    const postId = req.params.id;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "Invalid text" });

    const comment = await Comment.create({
      text,
      author: commentedUserId,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "profilePicture userName",
    });

    const post = await Post.findById(postId);
    await post.comments.push(comment._id);
    await post.save();

    // Invalidate cache
    await redisClient.del(`post:${postId}`);

    return res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    console.log(error);
  }
};
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const authorId = req.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== authorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);

    await redisClient.del(`post:${postId}`);

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);

    if (post.author.toString() !== authorId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    await Post.findByIdAndDelete(postId);
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    await Comment.deleteMany({ post: postId });

    await redisClient.del(`posts:all`);
    await redisClient.del(`user:${authorId}:posts:page:1`);
    await redisClient.del(`post:${postId}`);

    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.log(error);
  }
};
export const bookmarkPost = async (req, res) => {
  try {
    const author = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const user = await User.findById(author);
    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();

      await redisClient.del(`user:${author}:bookmarks`);

      return res
        .status(200)
        .json({ type: "unsaved", message: "Bookmark removed", post });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();

      await redisClient.del(`user:${author}:bookmarks`);

      return res
        .status(200)
        .json({ type: "saved", message: "Post bookmarked successfully", post });
    }
  } catch (error) {
    console.log(error);
  }
};
