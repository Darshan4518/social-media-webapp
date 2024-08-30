import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  followRequest,
  followSuccess,
  setSuggestedUsers,
  unfollowSuccess,
} from "@/redux/authSlice";
import { ScrollArea } from "./ui/scroll-area";
import { Link } from "react-router-dom";

const SuggestedUsers = () => {
  const dispatch = useDispatch();
  const { user, userProfile } = useSelector((store) => store.auth);
  const { suggestedUsers } = useSelector((store) => store.auth);
  useEffect(() => {
    const fetchuggestedUsers = async () => {
      try {
        const res = await axios.get(
          "https://instagram-olwk.onrender.com/api/v1/user/suggestedusers",
          { withCredentials: true }
        );
        if (res.status === 200) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchuggestedUsers();
  }, []);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

  useEffect(() => {
    setIsFollowing(userProfile?.followers?.includes(user?._id) || false);
  }, [userProfile, user]);

  const followOrUnfollowUser = async (id) => {
    if (isRequestInProgress) return;
    setIsRequestInProgress(true);
    dispatch(followRequest());

    try {
      const res = await axios.post(
        `https://instagram-olwk.onrender.com/api/v1/user/followorunfollow/${id}`,
        {},
        { withCredentials: true }
      );

      const { action, user: updatedUser } = res.data;

      if (action === "follow") {
        setIsFollowing(true);
        dispatch(followSuccess(updatedUser));
      } else if (action === "unfollow") {
        setIsFollowing(false);
        dispatch(unfollowSuccess(updatedUser));
      }
    } catch (error) {
      dispatch(followFailure(error.message));
    } finally {
      setIsRequestInProgress(false);
    }
  };

  return (
    <div className=" xl:w-[25%] md:w-[30%] hidden lg:block">
      <div className=" flex items-center justify-between gap-x-2">
        <div className="flex gap-x-2 items-center">
          <Avatar className="w-[40px]">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>
              {user?.userName?.slice(0, 2)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="">
            <p className="text-sm md:text-sm lg:text-[14px]  font-bold capitalize">
              {user?.userName}
            </p>
          </div>
        </div>
        <Link to={"/login"}>
          <p className=" text-blue-500">Switch</p>
        </Link>
      </div>
      <div>
        <div className=" flex  items-center justify-between  gap-x-2 text-sm  mt-8">
          <p className=" font-semibold">Suggested for you</p>
          <p className=" font-bold">See All</p>
        </div>
        {suggestedUsers?.map((user) => {
          return (
            <ScrollArea
              className=" space-y-4  max-h-screen"
              key={user?.userName}
            >
              <Link to={`/profile/${user?._id}`}>
                <div className=" flex items-center justify-between gap-x-2">
                  <div className="flex gap-x-2 items-center">
                    <Avatar className="w-[40px]">
                      <AvatarImage src={user?.profilePicture} />
                      <AvatarFallback>
                        {user?.userName?.slice(0, 2)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="">
                      <p className="text-sm md:text-sm lg:text-[14px]  font-bold capitalize">
                        {user?.userName}
                      </p>
                    </div>
                  </div>
                  <p
                    className=" text-blue-500 cursor-pointer"
                    onClick={() => followOrUnfollowUser(user?._id)}
                  >
                    {isFollowing ? "unfollow" : "follow"}
                  </p>
                </div>
              </Link>
            </ScrollArea>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedUsers;
