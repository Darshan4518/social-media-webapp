import React, { useEffect, useState } from "react";
import Post from "./Post";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postsSlice";
import CircularProgress from "@mui/material/CircularProgress";

const Feeds = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.posts);
  const [loading, setLoading] = useState(true);

  const getPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/v1/post/all", {
        withCredentials: true,
      });
      dispatch(setPosts(res.data.posts));
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="w-[85%]">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <CircularProgress />
        </div>
      ) : (
        posts?.map((post, ind) => <Post key={ind} post={post} />)
      )}
    </div>
  );
};

export default Feeds;
