import React, { useState } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SlowMotionVideoOutlinedIcon from "@mui/icons-material/SlowMotionVideoOutlined";
import { PiMessengerLogoLight } from "react-icons/pi";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { Link, useNavigate } from "react-router-dom";

import instaLogo from "../assets/instagramlogo.png";
import { FaInstagram } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import CreatePost from "./CreatePost";
import { setAuthUser } from "@/redux/authSlice";
import { setPosts } from "@/redux/postsSlice";
import { setSelectedUser } from "@/redux/chatSlice";
import { LogOut } from "lucide-react";
import axios from "axios";
import LikeNotificationBar from "./LikeNotificationBar";
import SearchBar from "./SearchBar";
import { toast } from "sonner";
const Sidebar = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        "https://social-media-webapp-2z2m.onrender.com/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedUser(null));
        dispatch(setPosts([]));
        navigate("/login");
      } else {
        toast.error("Logout failed:", res.data.message);
      }
    } catch (error) {
      toast.error("something went worng");
    }
  };
  const { user } = useSelector((store) => store.auth);
  const { likeNotify } = useSelector((store) => store.rtmLikeNotify);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [openLikeSheet, setOpenLikeSheet] = useState(false);
  const [openSearchSheet, setOpenSearchSheet] = useState(false);

  const sidebarItems = [
    { name: "Home", Icon: HomeOutlinedIcon },
    { name: "Search", Icon: SearchOutlinedIcon },
    { name: "Explore", Icon: ExploreOutlinedIcon },
    { name: "Reels", Icon: SlowMotionVideoOutlinedIcon },
    { name: "Messages", Icon: PiMessengerLogoLight },
    { name: "Favorites", Icon: FavoriteBorderOutlinedIcon },
    { name: "Create", Icon: AddBoxOutlinedIcon },
  ];

  const pageType = (type) => {
    if (type === "create") {
      setOpenCreatePost(true);
    }
    if (type === "home") {
      navigate("/");
    }
    if (type === "messages") {
      navigate("/chat");
    }
    if (type === "favorites") {
      setOpenLikeSheet(true);
    }
    if (type === "search") {
      setOpenSearchSheet(true);
    }
  };

  return (
    <div className="flex h-screen flex-col justify-between border-e bg-white ">
      <div className="px-4 py-6  fixed top-2">
        <h3 className=" font-bold text-gray-800 text-center text-xl">
          D-Media
        </h3>
        <ul className="mt-6 space-y-3">
          {sidebarItems.map(({ name, Icon }) => (
            <li key={name} className="relative">
              <div
                className="flex items-center rounded-lg px-4 py-3 space-x-3 text-sm font-medium text-gray-700 hover:bg-slate-100 cursor-pointer"
                onClick={() => pageType(name.toLowerCase())}
              >
                <div className="relative">
                  <Icon size={28} sx={{ fontSize: 28 }} />
                  {name === "Favorites" && likeNotify?.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full">
                      {likeNotify?.length}
                    </span>
                  )}
                </div>
                <span className="capitalize text-[1.1rem] hidden lg:block">
                  {name}
                </span>
              </div>
            </li>
          ))}
          <li className="rounded-lg px-3 text-sm font-medium text-gray-700">
            <Link
              to={`/profile/${user?._id}`}
              className="flex items-center gap-3 bg-white p-2 hover:bg-gray-50"
            >
              <Avatar className="w-[35px] h-[35px]">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>
                  {user?.userName?.slice(0, 2)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <p className="capitalize text-[1.1rem] hidden lg:block">
                Profile
              </p>
            </Link>
          </li>
          <li
            className="flex items-center rounded-lg px-4 py-3 space-x-3 text-sm font-medium text-gray-700 hover:bg-slate-100 cursor-pointer"
            onClick={logoutHandler}
          >
            <LogOut />
            <span className="capitalize text-[1.1rem] hidden lg:block">
              Logout
            </span>
          </li>
        </ul>
        <CreatePost open={openCreatePost} setOpen={setOpenCreatePost} />
      </div>
      <LikeNotificationBar open={openLikeSheet} setOpen={setOpenLikeSheet} />
      <SearchBar open={openSearchSheet} setOpen={setOpenSearchSheet} />
    </div>
  );
};

export default Sidebar;
