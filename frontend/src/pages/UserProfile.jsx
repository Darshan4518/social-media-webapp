import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "./MainLayout";
import { Button } from "@/components/ui/button";
import { Loader, Settings } from "lucide-react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { setAuthUser, followUser, unfollowUser } from "@/redux/authSlice";
import { LuGrid } from "react-icons/lu";
import { GoVideo } from "react-icons/go";
import { FaBookmark } from "react-icons/fa";

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("post");

  const followOrUnfollowUser = async (id) => {
    const res = await axios.post(
      `https://social-media-webapp-2z2m.onrender.com/api/v1/user/followorunfollow/${id}`,
      {},
      { withCredentials: true }
    );
    return res.data;
  };

  const fetchUserProfile = async () => {
    const res = await axios.get(
      `https://social-media-webapp-2z2m.onrender.com/api/v1/user/${id}/profile`,
      { withCredentials: true }
    );
    return res.data.user;
  };

  const { isPending, data: userProfile } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: fetchUserProfile,
  });

  const isFollowing = user?.following?.includes(userProfile?._id);
  const followerCount = userProfile?.followers?.length || 0;

  const mutation = useMutation({
    mutationFn: () => followOrUnfollowUser(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["userProfile", id] });

      const previousUserData = queryClient.getQueryData(["userProfile", id]);

      if (isFollowing) {
        dispatch(unfollowUser({ userId: id }));
      } else {
        dispatch(followUser({ userId: id }));
      }

      return { previousUserData };
    },
    onError: (error, variables, context) => {
      if (context?.previousUserData) {
        queryClient.setQueryData(["userProfile", id], context.previousUserData);
      }
    },
    onSuccess: (data) => {
      const { message, currentUser } = data;
      dispatch(setAuthUser(currentUser));
      toast.success(message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", id] });
    },
  });

  return (
    <MainLayout>
      <div className="flex flex-col items-center mx-auto w-full mt-7 gap-3 px-4 sm:px-6 lg:px-8">
        {isPending ? (
          <div className="flex justify-center items-center h-screen">
            <Loader className="animate-spin size-12" />
          </div>
        ) : (
          <div className="w-full max-w-4xl">
            <div className="flex flex-col sm:flex-row gap-x-10 md:gap-x-20 items-center mb-5">
              <Avatar className="w-24 h-24 sm:w-[150px] sm:h-[150px]">
                <AvatarImage src={userProfile?.profilePicture} />
                <AvatarFallback>
                  {userProfile?.userName?.slice(0, 2)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 md:mt-0 text-center md:text-left">
                <div className="flex flex-col sm:flex-row gap-x-3 md:items-center">
                  <div className="flex gap-x-2 items-center">
                    <p className="text-lg md:text-2xl capitalize">
                      {userProfile?.userName}
                    </p>
                    {!user || user?._id === userProfile?._id ? null : (
                      <Button
                        variant="ghost"
                        className={`${
                          isFollowing
                            ? "bg-gray-400 hover:bg-gray-300"
                            : "bg-blue-500 hover:bg-blue-300"
                        } mx-4 md:hidden`}
                        onClick={() => mutation.mutate(id)}
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                    )}
                  </div>
                  {user?._id === userProfile?._id ? (
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
                      onClick={() => mutation.mutate(id)}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  )}
                </div>
                <div className="flex  items-center my-3 gap-x-5">
                  <h2>{userProfile?.posts?.length} posts</h2>
                  <h2>{followerCount} followers</h2>
                  <h2>{userProfile?.following?.length} following</h2>
                </div>
                <p className="max-w-[250px] my-3 text-[12px] sm:text-base">
                  {userProfile?.bio}
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
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

            {/* Tab Content */}
            <div className="flex flex-wrap gap-4 max-w-full">
              {activeTab === "post" &&
                userProfile?.posts?.map((post, index) => (
                  <div
                    key={index}
                    className="lg:max-w-[300px] lg:max-h-[300px] max-w-[200px] max-h-[300px] h-60"
                  >
                    <img
                      src={post.image}
                      alt="post"
                      className="w-full h-full object-fill rounded-sm"
                    />
                  </div>
                ))}

              {activeTab === "reels" && (
                <div>
                  <h2>No Reels Yet</h2>
                </div>
              )}

              {activeTab === "saved" && (
                <div>
                  <h2>No Saved Posts Yet</h2>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default UserProfile;
