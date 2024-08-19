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
import CircularProgress from "@mui/material/CircularProgress";

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading } = useGetUserProfile(id);

  const { userProfile, user } = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState("post");

  const isLoginedUser = user?._id === userProfile?._id;

  return (
    <MainLayout>
      <div className="flex flex-col items-center mx-auto w-full mt-7 gap-3 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <CircularProgress />
          </div>
        ) : (
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
                  <div className="flex gap-x-2 items-center">
                    <p className="text-lg md:text-2xl capitalize ">
                      {userProfile?.userName}
                    </p>
                    {isLoginedUser ? (
                      <Button
                        variant="ghost"
                        className="bg-blue-500 mx-4 md:hidden hover:bg-blue-300"
                      >
                        Follow
                      </Button>
                    ) : (
                      <Settings size={20} className="md:hidden" />
                    )}
                  </div>
                  {isLoginedUser ? (
                    <div className="flex gap-x-3 items-center">
                      <Button
                        variant="ghost"
                        className="bg-gray-200 mt-2 md:mt-0"
                        onClick={() => navigate("/profile/edit")}
                      >
                        Edit profile
                      </Button>
                      <Button
                        variant="ghost"
                        className="bg-gray-200 mt-2 md:mt-0"
                      >
                        Archive
                      </Button>
                      <Settings className="hidden md:flex mt-2 md:mt-0" />
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="bg-blue-500 mx-4 hidden md:block hover:bg-blue-300 w-[100px]"
                    >
                      Follow
                    </Button>
                  )}
                </div>
                <div className="hidden md:flex flex-row items-center my-3 gap-x-5">
                  <h2>{userProfile?.posts?.length} posts</h2>
                  <h2>{userProfile?.followers?.length} followers</h2>
                  <h2>{userProfile?.following?.length} following</h2>
                </div>
                <p className="max-w-[250px] my-3 text-[12px] sm:text-base">
                  {userProfile?.bio}
                </p>
              </div>
            </div>
            <div className="flex md:hidden items-center justify-evenly text-lg gap-x-5 my-4">
              <h2>{userProfile?.posts?.length} posts</h2>
              <h2>{userProfile?.followers?.length} followers</h2>
              <h2>{userProfile?.following?.length} following</h2>
            </div>
            <hr />
            <div>
              <div className="flex items-center gap-x-8 justify-center mb-4">
                {["post", "reels", "saved"].map((tab) => (
                  <h2
                    key={tab}
                    className={`${
                      activeTab === tab ? "border-b-2 border-gray-800" : ""
                    } p-1 cursor-pointer flex items-center gap-x-2 font-bold`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === "post" && <LuGrid />}
                    {tab === "reels" && <GoVideo />}
                    {tab === "saved" && <FaBookmark />}
                    {tab.toUpperCase()}
                  </h2>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 max-w-full">
                {activeTab === "post" &&
                  userProfile?.posts?.map((post, index) => (
                    <div
                      key={index}
                      className="lg:max-w-[300px] lg:max-h-[300px] max-w-[200px] max-h-[200px]"
                    >
                      <img
                        src={post.image}
                        alt="post"
                        className="w-full h-full object-cover rounded-sm"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default UserProfile;
