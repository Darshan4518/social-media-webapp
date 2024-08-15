import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  MoreHorizOutlined,
  BookmarkBorderOutlined,
  FavoriteBorder,
} from "@mui/icons-material";
import { Button } from "./ui/button";
import { FaRegComment } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import CommentDialog from "./CommentDailog";

const Post = () => {
  const [comment, setComment] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setComment(inputText);
    } else {
      setComment("");
    }
  };
  return (
    <div className="space-y-4 w-full max-w-lg mx-auto my-6 px-4 md:px-6 lg:px-8">
      <div className="flex gap-x-3 items-center justify-between">
        <div className="flex gap-x-2 items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="text-sm md:text-base lg:text-lg">User name</p>
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizOutlined className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
              <Button variant="ghost" className="text-red-500">
                Report
              </Button>
              <Button variant="ghost" className="text-red-500">
                Unfollow
              </Button>
              <Button variant="ghost">Add to favorite</Button>
              <Button variant="ghost">About this account</Button>
              <Button variant="ghost">Cancel</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="border-gray-300 border p-1">
        <img
          src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1200,q_50/lsci/db/PICTURES/CMS/385700/385750.jpg"
          alt="post"
          className="w-full max-h-[500px] object-contain"
        />
      </div>
      <div className="flex items-center justify-between px-3">
        <div className="flex items-center gap-x-6">
          <FavoriteBorder sx={{ fontSize: 26 }} />
          <FaRegComment
            size={22}
            onClick={() => {
              setDialogOpen(true);
            }}
          />
          <LuSend size={22} />
        </div>
        <BookmarkBorderOutlined sx={{ fontSize: 26 }} />
      </div>
      <div className="flex flex-col justify-between h-full px-3">
        <div>
          <p className="w-full text-sm md:text-base lg:text-[1rem]">
            10,000 likes
          </p>
          <p className="line-clamp-2 w-full text-sm md:text-base lg:text-[1rem]">
            <span className="font-bold">username</span> Lorem ipsum dolor sit,
            amet consectetur adipisicing elit. Odio eum, id eligendi doloremque
            harum illum nostrum neque, cupiditate vero earum quos, ea vitae sunt
            ducimus assumenda iusto excepturi dolore explicabo?
          </p>
          <p className="text-gray-500">...more</p>
          <p
            className="cursor-pointer text-sm md:text-base lg:text-[1rem] text-gray-500"
            onClick={() => {
              setDialogOpen(true);
            }}
          >
            View all 140 comments
          </p>
          <CommentDialog open={dialogOpen} setOpen={setDialogOpen} />
        </div>
        <div className="my-2 flex justify-between items-center border-t border-gray-300 pt-2">
          <input
            type="text"
            value={comment}
            placeholder="Add a comment..."
            className="border-none outline-none flex-grow"
            onChange={changeEventHandler}
          />
          {comment && (
            <span className="text-blue-500 cursor-pointer">Post</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
