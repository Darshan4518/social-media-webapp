import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { ScrollArea } from "./ui/scroll-area";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { setSuggestedUsers } from "@/redux/authSlice";

const SuggestedUsers = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const fetchSuggestedUsers = async () => {
    const res = await axios.get(
      "https://social-media-webapp-2z2m.onrender.com/api/v1/user/suggestedusers",
      {
        withCredentials: true,
      }
    );
    return res.data.users;
  };

  const {
    isPending,
    data: suggestedUsers,
    isSuccess,
  } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: fetchSuggestedUsers,
    staleTime: 60000,
  });

  useEffect(() => {
    if (isSuccess && suggestedUsers) {
      dispatch(setSuggestedUsers(suggestedUsers));
    }
  }, [isSuccess, suggestedUsers, dispatch]);

  return (
    <div className="xl:w-[25%] md:w-[30%] hidden lg:block">
      <div className="flex items-center justify-between gap-x-2 mb-4">
        <div className="flex gap-x-2 items-center">
          <Avatar className="w-[40px]">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>
              {user?.userName?.slice(0, 2)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm md:text-sm lg:text-[14px] font-bold capitalize">
              {user?.userName}
            </p>
          </div>
        </div>
        <Link to="/login">
          <p className="text-blue-500">Switch</p>
        </Link>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between gap-x-2 text-sm">
          <p className="font-semibold">Suggested for you</p>
          <p className="font-bold cursor-pointer">See All</p>
        </div>
      </div>

      {isPending ? (
        <div className=" mx-auto flex justify-center h-full items-center w-full">
          <Loader2 className=" animate-spin size-6 " />
        </div>
      ) : (
        <ScrollArea className="space-y-4 max-h-screen">
          {suggestedUsers?.map((suggestedUser) => {
            const isFollowing = suggestedUser?.followers?.includes(user?._id);

            return (
              <div
                className="flex items-center justify-between gap-x-2"
                key={suggestedUser._id}
              >
                <Link
                  to={`/profile/${suggestedUser._id}`}
                  className="flex gap-x-2 items-center"
                >
                  <Avatar className="w-[40px]">
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback>
                      {suggestedUser?.userName?.slice(0, 2)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm md:text-sm lg:text-[14px] font-bold capitalize">
                      {suggestedUser?.userName}
                    </p>
                  </div>
                </Link>
                <button className="text-blue-500 cursor-pointer">
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
            );
          })}
        </ScrollArea>
      )}
    </div>
  );
};

export default SuggestedUsers;
