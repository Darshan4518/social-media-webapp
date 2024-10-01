import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  MoreHorizOutlined,
  BookmarkBorderOutlined,
  FavoriteBorder,
  Favorite,
} from "@mui/icons-material";
import { Button } from "./ui/button";
import { FaRegComment } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import CommentDialog from "./CommentDailog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPosts } from "@/redux/postsSlice";
import CommentSection from "./CommentSection";

const Post = ({ post }) => {
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.posts);

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [text, setComment] = useState("");
  const [like, setLike] = useState(post?.likes?.includes(user?._id) || false);
  const [likeCount, setLikeCount] = useState(post?.likes?.length);
  const [dialogOpen, setDialogOpen] = useState(false);

  const deletePost = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );
      if (res.status === 201) {
        dispatch(setPosts(posts.filter((p) => p._id !== post._id)));
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const likeOrDislike = async () => {
    try {
      const action = like ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:5000/api/v1/post/${post?._id}/${action}`,
        { withCredentials: true }
      );
      if (res.status === 201) {
        setLike(!like);
        setLikeCount((prevCount) => (like ? prevCount - 1 : prevCount + 1));

        const updatedLikes = like
          ? post.likes.filter((id) => id !== user._id)
          : [...post.likes, user._id];
        const updatedData = posts.map((p) =>
          p._id === post._id ? { ...p, likes: updatedLikes } : p
        );
        dispatch(setPosts(updatedData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/post/${post._id}/comment`,
        { text },
        { withCredentials: true }
      );
      if (res.status === 201) {
        const updatedComment = [...post.comments, res.data.comment];
        const updatedData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedComment } : p
        );
        dispatch(setPosts(updatedData));
        setComment("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-4 w-full sm:max-w-lg mx-auto my-6 px-4 md:px-6 lg:px-8">
      <div className="flex gap-x-3 items-center justify-between">
        <div className="flex gap-x-2 items-center">
          <Avatar>
            <AvatarImage src={post?.author?.profilePicture} />
            <AvatarFallback>
              {post?.author?.userName?.slice(0, 2)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <p className="text-sm md:text-base lg:text-lg capitalize">
            {post?.author?.userName}
          </p>
        </div>
        <div>
          <Dialog open={open}>
            <MoreHorizOutlined
              className="cursor-pointer"
              onClick={() => {
                setOpen(true);
              }}
            />
            <DialogContent onInteractOutside={() => setOpen(false)}>
              <Button variant="ghost" className="text-red-500">
                Report
              </Button>
              <Button variant="ghost" className="text-red-500">
                Unfollow
              </Button>
              <Button variant="ghost">Add to favorite</Button>
              <Button variant="ghost">About this account</Button>
              {user && user?._id === post?.author?._id && (
                <Button variant="ghost" onClick={deletePost}>
                  Delete Post
                </Button>
              )}
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="border-gray-300 border p-1">
        <img
          src={post?.image}
          alt="post"
          className="w-full lg:max-h-[500px] max-h-[300px] object-contain"
        />
      </div>
      <div className="flex items-center justify-between px-3">
        <div className="flex items-center gap-x-6">
          {like ? (
            <Favorite
              className="cursor-pointer text-red-600 "
              sx={{ fontSize: 26 }}
              onClick={likeOrDislike}
            />
          ) : (
            <FavoriteBorder
              sx={{ fontSize: 26 }}
              className="cursor-pointer "
              onClick={likeOrDislike}
            />
          )}
          <FaRegComment
            size={22}
            onClick={() => {
              setDialogOpen(true);
            }}
            className="cursor-pointer"
          />
          <LuSend size={22} className="cursor-pointer" />
        </div>
        <BookmarkBorderOutlined
          sx={{ fontSize: 26 }}
          className="cursor-pointer"
        />
      </div>
      <div className="flex flex-col justify-between h-full px-3">
        <div>
          <p className="w-full text-sm md:text-base lg:text-[1rem]">
            {likeCount} likes
          </p>
          <p className="line-clamp-2 w-full text-sm md:text-base lg:text-[1rem] ">
            <span className="font-bold ">{post?.author?.userName}</span>
            <span className="px-2">{post?.caption}</span>
          </p>
          <p className="text-gray-500">...more</p>
          <p
            className="cursor-pointer text-sm md:text-base lg:text-[1rem] text-gray-500"
            onClick={() => {
              setDialogOpen(true);
            }}
          >
            View all {post?.comments?.length} comments
          </p>
          <CommentDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
            post={post}
            text={text}
            setComment={setComment}
            addComment={addComment}
            like={like}
            likeOrDislike={likeOrDislike}
          />
        </div>
        <CommentSection
          addComment={addComment}
          text={text}
          setComment={setComment}
        />
      </div>
    </div>
  );
};

export default Post;
