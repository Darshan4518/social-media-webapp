import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "./MainLayout";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { LuGrid } from "react-icons/lu";
import { GoVideo } from "react-icons/go";
import { FaBookmark } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import {
  followFailure,
  followSuccess,
  unfollowSuccess,
  followRequest,
} from "@/redux/authSlice";

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading } = useGetUserProfile(id);

  const { userProfile, user } = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState("post");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

  const isLoggedUser = user?._id === userProfile?._id;

  useEffect(() => {
    setIsFollowing(userProfile?.followers?.includes(user?._id) || false);
    setFollowerCount(userProfile?.followers?.length || 0);
  }, [userProfile, user]);

  const followOrUnfollowUser = async () => {
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
        setFollowerCount((prev) => prev + 1);
        dispatch(followSuccess(updatedUser));
      } else if (action === "unfollow") {
        setIsFollowing(false);
        setFollowerCount((prev) => prev - 1);
        dispatch(unfollowSuccess(updatedUser));
      }
    } catch (error) {
      dispatch(followFailure(error.message));
    } finally {
      setIsRequestInProgress(false);
    }
  };

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
                    <p className="text-lg md:text-2xl capitalize">
                      {userProfile?.userName}
                    </p>
                    {!isLoggedUser ? (
                      <Button
                        variant="ghost"
                        className={`${
                          isFollowing
                            ? "bg-gray-400 hover:bg-gray-300"
                            : "bg-blue-500 hover:bg-blue-300"
                        } mx-4 md:hidden`}
                        onClick={followOrUnfollowUser}
                        disabled={isRequestInProgress}
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                    ) : (
                      <Settings size={20} className="md:hidden" />
                    )}
                  </div>
                  {isLoggedUser ? (
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
                      className={`${
                        isFollowing
                          ? "bg-gray-400 hover:bg-gray-300"
                          : "bg-blue-500 hover:bg-blue-300"
                      } mx-4 hidden md:block w-[100px]`}
                      onClick={followOrUnfollowUser}
                      disabled={isRequestInProgress}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  )}
                </div>
                <div className="hidden md:flex flex-row items-center my-3 gap-x-5">
                  <h2>{userProfile?.posts?.length} posts</h2>
                  <h2>{followerCount} followers</h2>
                  <h2>{userProfile?.following?.length} following</h2>
                </div>
                <p className="max-w-[250px] my-3 text-[12px] sm:text-base">
                  {userProfile?.bio}
                </p>
              </div>
            </div>
            <div className="flex md:hidden items-center justify-evenly text-lg gap-x-5 my-4">
              <h2>{userProfile?.posts?.length} posts</h2>
              <h2>{followerCount} followers</h2>
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
