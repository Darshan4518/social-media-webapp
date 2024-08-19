import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSuggestedUsers } from "@/redux/authSlice";
import { ScrollArea } from "./ui/scroll-area";
import { Link } from "react-router-dom";

const SuggestedUsers = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { suggestedUsers } = useSelector((store) => store.auth);
  useEffect(() => {
    const fetchuggestedUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/user/suggestedusers",
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
                <p className=" text-blue-500">Follow</p>
              </div>
            </ScrollArea>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedUsers;
