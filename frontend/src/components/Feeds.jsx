import React from "react";
import Post from "./Post";

const Feeds = () => {
  const posts = [1, 2, 3, 4];
  return (
    <div className=" w-[85%]">
      {posts.map((post) => {
        return <Post />;
      })}
    </div>
  );
};

export default Feeds;
