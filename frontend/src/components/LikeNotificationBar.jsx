import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { clearLikeNotify } from "@/redux/rtmLikeSlice";
import { useDispatch, useSelector } from "react-redux";

const LikeNotificationBar = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { likeNotify } = useSelector((store) => store.rtmLikeNotify);

  return (
    <Sheet open={open}>
      <SheetContent
        onInteractOutside={() => {
          setOpen(false);
          dispatch(clearLikeNotify());
        }}
        side="left"
      >
        <SheetHeader>
          <SheetTitle>Notification</SheetTitle>
        </SheetHeader>
        <ScrollArea className=" my-3">
          {likeNotify?.length > 0 ? (
            likeNotify?.map((item) => {
              return (
                <div
                  key={item?.postId}
                  className=" flex justify-between items-center"
                >
                  <div>
                    <div className="flex gap-x-2 items-center">
                      <Avatar className=" w-[35px] h-[35px]">
                        <AvatarImage src={item?.userDetails?.profilePicture} />
                        <AvatarFallback>
                          {item?.userDetails?.userName
                            ?.slice(0, 2)
                            ?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <p className="text-sm md:text-base lg:text-lg capitalize">
                        {item?.userDetails?.userName}
                      </p>
                      <p>_liked your post </p>
                    </div>
                  </div>
                  <div>
                    <img
                      src={item?.post?.image}
                      alt="post"
                      className=" w-10 h-10 rounded-sm"
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="  h-screen w-full flex flex-1 items-center justify-center ">
              <p className=" font-bold text-xl"> No notifications</p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default LikeNotificationBar;
