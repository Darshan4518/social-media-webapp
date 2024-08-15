import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  BookmarkBorderOutlined,
  FavoriteBorder,
  FavoriteOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaRegComment } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { ScrollArea } from "./ui/scroll-area";

const CommentDialog = ({ open, setOpen }) => {
  const [comment, setComment] = useState("");
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setComment(inputText);
    } else {
      setComment("");
    }
  };
  return (
    <div>
      <Dialog open={open} className="flex items-center">
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="flex p-0 outline-none min-w-[90vw] md:min-w-[60vw] max-h-[80vh] md:max-h-[600px] overflow-hidden"
        >
          <div className="w-full md:w-[50%] max-h-[40vh] md:max-h-[600px]">
            <img
              src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1200,q_50/lsci/db/PICTURES/CMS/385700/385750.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-[50%] lg:p-1">
            <div className="flex gap-x-3 items-center justify-between border-b border-gray-300 p-3">
              <div className="flex gap-x-2 items-center">
                <Avatar className="w-[35px] h-[35px]">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="text-sm md:text-base lg:text-[1rem]">User name</p>
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
            <ScrollArea className=" h-[65%] my-2 px-2 scroll-smooth">
              <div className="flex gap-x-2 items-center my-2">
                <Avatar className="w-[35px] h-[35px]">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex justify-between items-center w-full gap-x-2">
                  <p className="text-sm md:text-base lg:text-[1rem] space-x-2 w-full">
                    <span className="font-bold lowercase">User name</span>
                    <span>super bro</span>
                  </p>
                  <FavoriteBorder sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div className="flex gap-x-2 items-center my-2">
                <Avatar className="w-[35px] h-[35px]">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex justify-between items-center w-full gap-x-2">
                  <p className="text-sm md:text-base lg:text-[1rem] space-x-2 w-full">
                    <span className="font-bold lowercase">User name</span>
                    <span>super bro</span>
                  </p>
                  <FavoriteBorder sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div className="flex gap-x-2 items-center my-2">
                <Avatar className="w-[35px] h-[35px]">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex justify-between items-center w-full gap-x-2">
                  <p className="text-sm md:text-base lg:text-[1rem] space-x-2 w-full">
                    <span className="font-bold lowercase">User name</span>
                    <span>super bro</span>
                  </p>
                  <FavoriteBorder sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div className="flex gap-x-2 items-center my-2">
                <Avatar className="w-[35px] h-[35px]">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex justify-between items-center w-full gap-x-2">
                  <p className="text-sm md:text-base lg:text-[1rem] space-x-2 w-full">
                    <span className="font-bold lowercase">User name</span>
                    <span>super bro</span>
                  </p>
                  <FavoriteBorder sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div className="flex gap-x-2 items-center my-2">
                <Avatar className="w-[35px] h-[35px]">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex justify-between items-center w-full gap-x-2">
                  <p className="text-sm md:text-base lg:text-[1rem] space-x-2 w-full">
                    <span className="font-bold lowercase">User name</span>
                    <span>super bro</span>
                  </p>
                  <FavoriteBorder sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div className="flex gap-x-2 items-center my-2">
                <Avatar className="w-[35px] h-[35px]">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex justify-between items-center w-full gap-x-2">
                  <p className="text-sm md:text-base lg:text-[1rem] space-x-2 w-full">
                    <span className="font-bold lowercase">User name</span>
                    <span>super bro</span>
                  </p>
                  <FavoriteBorder sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div className="flex gap-x-2 items-center my-2">
                <Avatar className="w-[35px] h-[35px]">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex justify-between items-center w-full gap-x-2">
                  <p className="text-sm md:text-base lg:text-[1rem] space-x-2 w-full">
                    <span className="font-bold lowercase">User name</span>
                    <span>super bro</span>
                  </p>
                  <FavoriteBorder sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div className="flex gap-x-2 items-center my-2">
                <Avatar className="w-[35px] h-[35px]">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex justify-between items-center w-full gap-x-2">
                  <p className="text-sm md:text-base lg:text-[1rem] space-x-2 w-full">
                    <span className="font-bold lowercase">User name</span>
                    <span>super bro</span>
                  </p>
                  <FavoriteBorder sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div className="flex gap-x-2 items-center my-2">
                <Avatar className="w-[35px] h-[35px]">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex justify-between items-center w-full gap-x-2">
                  <p className="text-sm md:text-base lg:text-[1rem] space-x-2 w-full">
                    <span className="font-bold lowercase">User name</span>
                    <span>super bro</span>
                  </p>
                  <FavoriteBorder sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div className="flex gap-x-2 items-center my-2">
                <Avatar className="w-[35px] h-[35px]">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex justify-between items-center w-full gap-x-2">
                  <p className="text-sm md:text-base lg:text-[1rem] space-x-2 w-full">
                    <span className="font-bold lowercase">User name</span>
                    <span>super bro</span>
                  </p>
                  <FavoriteBorder sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div className="flex gap-x-2 items-center my-2">
                <Avatar className="w-[35px] h-[35px]">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex justify-between items-center w-full gap-x-2">
                  <p className="text-sm md:text-base lg:text-[1rem] space-x-2 w-full">
                    <span className="font-bold lowercase">User name</span>
                    <span>super bro</span>
                  </p>
                  <FavoriteBorder sx={{ fontSize: 20 }} />
                </div>
              </div>
              <div className="flex gap-x-2 items-center my-2">
                <Avatar className="w-[35px] h-[35px]">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex justify-between items-center w-full gap-x-2">
                  <p className="text-sm md:text-base lg:text-[1rem] space-x-2 w-full">
                    <span className="font-bold lowercase">User name</span>
                    <span>super bro</span>
                  </p>
                  <FavoriteBorder sx={{ fontSize: 20 }} />
                </div>
              </div>
            </ScrollArea>

            <div className="items-end">
              <div>
                <div className="lg:px-3 space-y-1">
                  <div className="flex items-center justify-between mt-5">
                    <div className="flex items-center gap-x-6">
                      <FavoriteBorder sx={{ fontSize: 26 }} />
                      <FaRegComment size={22} />
                      <LuSend size={22} />
                    </div>
                    <BookmarkBorderOutlined sx={{ fontSize: 26 }} />
                  </div>
                  <p className="w-full text-sm md:text-base lg:text-[0.9rem] font-semibold">
                    10,000 likes
                  </p>
                  <p className="text-sm font-semibold">1 day ago </p>
                </div>
              </div>
              <div className="my-2 flex justify-between items-center">
                <input
                  type="text"
                  value={comment}
                  placeholder="Add a comment..."
                  className="border-none outline-none flex-grow"
                  onChange={changeEventHandler}
                />
                <span className="text-blue-500 cursor-pointer">Post</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentDialog;
