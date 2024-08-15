import React, { useState } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SlowMotionVideoOutlinedIcon from "@mui/icons-material/SlowMotionVideoOutlined";
import { PiMessengerLogoLight } from "react-icons/pi";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { Link } from "react-router-dom";

import instaLogo from "../assets/instagramlogo.png";
import { FaInstagram } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import CreatePost from "./CreatePost";
const Sidebar = () => {
  const { user } = useSelector((store) => store.auth);
  const [openCreatePost, setOpenCreatePost] = useState(false);
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
  };

  return (
    <div className="flex h-screen flex-col justify-between border-e bg-white ">
      <div className="px-4 py-6 fixed top-2">
        <span className="lg:grid h-10 w-32 hidden  place-content-center ">
          <img
            src={instaLogo}
            alt="logo"
            className="h-full w-full object-cover"
          />
        </span>
        <span className="grid h-10 px-4 mx-auto lg:hidden   ">
          <FaInstagram size={28} />
        </span>

        <ul className="mt-6 space-y-3">
          {sidebarItems.map(({ name, Icon }) => (
            <li key={name}>
              <div
                className="flex items-center rounded-lg px-4 py-3 space-x-3 text-sm font-medium text-gray-700 hover:bg-slate-100"
                onClick={() => pageType(name.toLowerCase())}
              >
                <Icon size={28} sx={{ fontSize: 28 }} />
                <span className="capitalize text-[1.1rem] hidden lg:block">
                  {name}
                </span>
              </div>
            </li>
          ))}
          <li className="rounded-lg px-3 text-sm font-medium text-gray-700">
            <Link
              to="/profile"
              className="flex items-center gap-3 bg-white p-2 hover:bg-gray-50"
            >
              <Avatar className="w-[35px]">
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
        </ul>
        <CreatePost open={openCreatePost} setOpen={setOpenCreatePost} />
      </div>
    </div>
  );
};

export default Sidebar;
