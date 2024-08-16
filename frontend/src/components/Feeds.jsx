import React, { useEffect } from "react";
import Post from "./Post";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postsSlice";

const Feeds = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.posts);
  const getPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/post/all", {
        withCredentials: true,
      });
      dispatch(setPosts(res.data.posts));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPosts();
  }, [posts]);

  return (
    <div className=" w-[85%]">
      {posts?.map((post, ind) => {
        return <Post key={ind} post={post} />;
      })}
    </div>
  );
};

export default Feeds;
