import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  BookmarkBorderOutlined,
  Favorite,
  FavoriteBorder,
  MoreHorizOutlined,
} from "@mui/icons-material";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaRegComment } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { ScrollArea } from "./ui/scroll-area";
import CommentSection from "./CommentSection";

const CommentDialog = ({
  open,
  setOpen,
  post,
  addComment,
  text,
  setComment,
  like,
  likeOrDislike,
}) => {
  return (
    <div>
      <Dialog open={open} className="flex items-center">
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="flex p-0 outline-none min-w-[90vw] md:min-w-[60vw] max-h-[90vh] overflow-y-auto md:max-h-[600px] "
        >
          <div className="w-full md:w-[50%] max-h-[60vh] md:max-h-[600px]">
            <img
              src={post?.image}
              alt="post"
              className="w-full h-full object-fill"
            />
          </div>
          <div className="w-full md:w-[50%] lg:p-1">
            <div className="flex gap-x-3 items-center justify-between border-b border-gray-300 md:p-3 p-1">
              <div className="flex gap-x-2 items-center">
                <Avatar className="w-[35px]">
                  <AvatarImage src={post?.author?.profilePicture} />
                  <AvatarFallback>
                    {post?.author?.userName?.slice(0, 2)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm md:text-base lg:text-[1rem]">
                  {post?.author?.userName}
                </p>
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
            <ScrollArea className=" md:h-[62%] h-[50%] my-2 px-2 scroll-smooth">
              {post?.comments?.length > 0 ? (
                post?.comments?.map((comment) => {
                  return (
                    <div className="flex gap-x-2 items-center my-2">
                      <Avatar className="w-[35px] h-[35px]">
                        <AvatarImage src={comment?.author?.profilePicture} />
                        <AvatarFallback>
                          {comment?.author?.userName
                            ?.slice(0, 2)
                            ?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex justify-between items-center w-full gap-x-2">
                        <p className="text-sm md:text-base lg:text-[1rem] space-x-2 w-full">
                          <span className="font-bold lowercase">
                            {comment?.author?.userName}
                          </span>
                          <span>{comment?.text}</span>
                        </p>
                        <FavoriteBorder sx={{ fontSize: 20 }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className=" flex items-center justify-center w-full">
                  <p>No comments on this post</p>
                </div>
              )}
            </ScrollArea>

            <div className="items-end ">
              <div className=" hidden lg:block">
                <div className="lg:px-3 space-y-1">
                  <div className="flex items-center justify-between mt-5">
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
                      <FaRegComment size={22} className=" cursor-pointer" />
                      <LuSend size={22} className=" cursor-pointer" />
                    </div>
                    <BookmarkBorderOutlined
                      sx={{ fontSize: 26 }}
                      className=" cursor-pointer"
                    />
                  </div>
                  <p className="w-full text-sm md:text-base lg:text-[0.9rem] font-semibold">
                    {post?.likes?.length} likes
                  </p>
                  <p className="text-sm font-semibold">1 day ago </p>
                </div>
              </div>
              <CommentSection
                addComment={addComment}
                text={text}
                setComment={setComment}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentDialog;
