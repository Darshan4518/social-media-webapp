import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "./MainLayout";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { LuGrid } from "react-icons/lu";
import { GoVideo } from "react-icons/go";
import { FaBookmark } from "react-icons/fa";

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  useGetUserProfile(id);

  const { userProfile } = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState("post");

  return (
    <MainLayout>
      <div className="flex flex-col items-center mx-auto w-full mt-7 gap-3 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          <div className="flex flex-row gap-x-10 md:gap-x-20 items-center mb-5">
            <Avatar className="w-20 h-20 md:w-[150px] md:h-[150px]">
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback>
                {userProfile?.userName?.slice(0, 2)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4 md:mt-0">
              <div className="flex flex-col md:flex-row gap-x-3 md:items-center">
                <div className="flex gap-x-2  items-center">
                  <p className="text-lg md:text-2xl capitalize ">
                    {userProfile?.userName}
                  </p>

                  <span className="md:hidden">
                    <Settings size={20} />
                  </span>
                </div>
                <div className="flex flex-row gap-x-3 items-center">
                  <Button
                    variant="ghost"
                    className="bg-gray-200 mt-2 md:mt-0"
                    onClick={() => {
                      navigate("/profile/edit");
                    }}
                  >
                    Edit profile
                  </Button>
                  <Button variant="ghost" className="bg-gray-200 mt-2 md:mt-0">
                    Archive
                  </Button>
                  <Button
                    variant="ghost"
                    className="mt-2 md:mt-0 hidden md:flex"
                  >
                    <Settings />
                  </Button>
                </div>
              </div>
              <div className="md:flex hidden  flex-row items-center my-3 gap-x-5">
                <h2>{userProfile?.posts?.length} posts</h2>
                <h2 variant="ghost">
                  {userProfile?.followers?.length} followers
                </h2>
                <h2 variant="ghost">
                  {userProfile?.following?.length} following
                </h2>
              </div>
              <p className="max-w-[250px] my-3 text-[12px] sm:text-base">
                {userProfile?.bio}
              </p>
            </div>
          </div>

          <div className="md:hidden flex items-center  justify-evenly text-lg gap-x-5 my-4">
            <h2>{userProfile?.posts?.length} posts</h2>
            <h2 variant="ghost">{userProfile?.followers?.length} followers</h2>
            <h2 variant="ghost">{userProfile?.following?.length} following</h2>
          </div>

          <hr />
          <div>
            <div className="flex items-center gap-x-8 justify-center mb-4 ">
              <h2
                className={`${
                  activeTab == "post" ? "border-b-2 border-gray-800" : ""
                }  p-1 cursor-pointer flex items-center gap-x-2 font-bold`}
                onClick={() => {
                  setActiveTab("post");
                }}
              >
                <LuGrid />
                POSTS
              </h2>
              <h2
                className={`${
                  activeTab == "reels" ? "border-b-2 border-gray-800" : ""
                }  p-1 cursor-pointer flex items-center gap-x-2 font-bold`}
                onClick={() => {
                  setActiveTab("reels");
                }}
              >
                <GoVideo />
                REELS
              </h2>
              <h2
                className={`${
                  activeTab == "saved" ? "border-b-2 border-gray-800" : ""
                }  p-1 cursor-pointer flex items-center gap-x-2 font-bold`}
                onClick={() => {
                  setActiveTab("saved");
                }}
              >
                <FaBookmark />
                SAVED
              </h2>
            </div>

            <div className=" flex flex-wrap gap-4 max-w-full">
              {activeTab == "post" &&
                userProfile?.posts?.map((post, index) => (
                  <div
                    key={index}
                    className="lg:max-w-[300px] lg:max-h-[300px]  max-w-[200px] max-h-[200px] p-1 border border-gray-400"
                  >
                    <img
                      src={post.image}
                      alt="post"
                      className="w-[100%] h-[100%] object-fill"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserProfile;
