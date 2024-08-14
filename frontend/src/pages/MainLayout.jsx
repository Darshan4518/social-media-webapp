import React from "react";

import Sidebar from "@/components/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className=" flex h-screen w-screen gap-2">
      <aside>
        <Sidebar />
      </aside>
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
