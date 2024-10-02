import Post from "./Post";
import axios from "axios";
import { useSelector } from "react-redux";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import { PiMessengerLogoLight } from "react-icons/pi";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import instaLogo from "../assets/instagramlogo.png";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import SearchBar from "./SearchBar";
import CreatePost from "./CreatePost";
import LikeNotificationBar from "./LikeNotificationBar";

const Feeds = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [openSearchSheet, setOpenSearchSheet] = useState(false);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [openLikeSheet, setOpenLikeSheet] = useState(false);

  const getPosts = async () => {
    const res = await axios.get("http://localhost:5000/api/v1/post/all", {
      withCredentials: true,
    });
    return res?.data?.posts || [];
  };

  const { isPending, data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    staleTime: 60000,
  });

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
      setOpenCreatePost(true);
    }
    if (type === "home") {
      navigate("/");
    }
    if (type === "messages") {
      navigate("/chat");
    }
    if (type === "search") {
      setOpenSearchSheet(true);
    }
    if (type == "favorites") {
      setOpenLikeSheet(true);
    }
  };

  return (
    <div className="w-full">
      {/* Loader for pending state */}
      {isPending ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="animate-spin size-10" />
        </div>
      ) : (
        <>
          {/* Sticky Header for Mobile */}
          <div className="flex items-center justify-between md:hidden sticky top-0 z-10 bg-white p-3 shadow-sm">
            <div className="h-10 w-32 place-content-center">
              <h3 className=" font-bold text-gray-800 text-center text-xl">
                D-Media
              </h3>
            </div>
            <div className="flex items-center justify-around gap-x-5">
              {sidebarItemsTop.map(({ name, Icon }) => (
                <div
                  className="text-sm font-medium text-gray-700 hover:bg-slate-100 cursor-pointer"
                  onClick={() => pageType(name.toLowerCase())}
                  key={name}
                >
                  <Icon size={28} sx={{ fontSize: 28 }} />
                </div>
              ))}
            </div>
          </div>

          {/* Posts */}
          <div className="p-4 space-y-6">
            {posts?.map((post, ind) => (
              <Post key={ind} post={post} />
            ))}
          </div>

          {/* Sticky Footer for Mobile */}
          <div className="flex items-center justify-between md:hidden sticky bottom-0 z-10 bg-white p-3 shadow-sm">
            {sidebarItemsBottom.map(({ name, Icon }) => (
              <div
                className="text-sm font-medium text-gray-700 hover:bg-slate-100 cursor-pointer"
                onClick={() => pageType(name.toLowerCase())}
                key={name}
              >
                <Icon size={28} sx={{ fontSize: 28 }} />
              </div>
            ))}

            {/* Profile Link */}
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
            </Link>
          </div>
        </>
      )}
      <SearchBar open={openSearchSheet} setOpen={setOpenSearchSheet} />
      <CreatePost open={openCreatePost} setOpen={setOpenCreatePost} />
      <LikeNotificationBar open={openLikeSheet} setOpen={setOpenLikeSheet} />
    </div>
  );
};

export default Feeds;
