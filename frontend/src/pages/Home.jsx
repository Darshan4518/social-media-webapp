import React from "react";
import MainLayout from "./MainLayout";
import Feeds from "@/components/Feeds";
import SuggestedUsers from "@/components/SuggestedUsers";

const Home = () => {
  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4 p-4">
        <Feeds className="md:w-2/3 w-full" />
        <SuggestedUsers className="lg:w-1/3 w-full" />
      </div>
    </MainLayout>
  );
};

export default Home;
