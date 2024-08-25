import React, { useEffect, useState } from "react";
import Post from "./Post";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { setPosts, addPost } from "@/redux/postsSlice";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import { PiMessengerLogoLight } from "react-icons/pi";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import instaLogo from "../assets/instagramlogo.png";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Feeds = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { posts } = useSelector((store) => store.posts);
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);

  const getPosts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://instagram-olwk.onrender.com/api/v1/post/all?page=${page}&limit=${limit}`,
        {
          withCredentials: true,
        }
      );
      if (page === 1) {
        dispatch(setPosts(res.data.posts));
      } else {
        dispatch(addPost(res.data.posts));
      }
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    getPosts(currentPage);
  }, [currentPage]);

  const sidebarItemsTop = [
    { name: "Create", Icon: AddBoxOutlinedIcon },
    { name: "Favorites", Icon: FavoriteBorderOutlinedIcon },
  ];

  const sidebarItemsBottom = [
    { name: "Home", Icon: HomeOutlinedIcon },
    { name: "Search", Icon: SearchOutlinedIcon },
    { name: "Explore", Icon: ExploreOutlinedIcon },
    { name: "Messages", Icon: PiMessengerLogoLight },
  ];
  const pageType = (type) => {
    if (type === "create") {
    }
    if (type === "home") {
      navigate("/");
    }
    if (type === "messages") {
      navigate("/chat");
    }
  };

  return (
    <div className="w-[100%]">
      {loading && currentPage === 1 ? (
        <div className="flex justify-center items-center h-screen">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className=" flex items-center justify-between md:hidden  sticky top-0 z-10 bg-white p-3 ">
            <div className=" h-10 w-32  place-content-center ">
              <img
                src={instaLogo}
                alt="logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div className=" flex items-center justify-around gap-x-5 ">
              {sidebarItemsTop.map(({ name, Icon }) => {
                return (
                  <div
                    className=" text-sm font-medium text-gray-700 hover:bg-slate-100 cursor-pointer"
                    onClick={() => pageType(name.toLowerCase())}
                    key={name}
                  >
                    <div className="relative">
                      <Icon size={28} sx={{ fontSize: 28 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {posts?.map((post, ind) => (
            <Post key={ind} post={post} />
          ))}
          {loading && currentPage > 1 && (
            <div className="flex justify-center my-4">
              <CircularProgress />
            </div>
          )}
          {currentPage < totalPages && (
            <div className="flex justify-center my-4">
              <Button variant="contained" onClick={handleLoadMore}>
                Load More
              </Button>
            </div>
          )}
          <div className=" flex items-center justify-between md:hidden sticky  bottom-0 z-10 bg-white p-3">
            {sidebarItemsBottom.map(({ name, Icon }) => {
              return (
                <div
                  className=" text-sm font-medium text-gray-700 hover:bg-slate-100 cursor-pointer "
                  onClick={() => pageType(name.toLowerCase())}
                  key={name}
                >
                  <div className="relative">
                    <Icon size={28} sx={{ fontSize: 28 }} />
                  </div>
                </div>
              );
            })}
            <Link
              to={`/profile/${user?._id}`}
              className="flex items-center gap-3 bg-white p-2 hover:bg-gray-50"
            >
              <Avatar className="w-[30px] h-[30px]">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>
                  {user?.userName?.slice(0, 2)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <p className="capitalize text-[1.1rem] hidden lg:block">
                Profile
              </p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Feeds;
