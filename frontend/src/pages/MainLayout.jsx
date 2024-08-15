import React from "react";
import Sidebar from "@/components/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen max-w-screen">
      <aside className="w-[20%] md:w-[15%] lg:w-[15%] hidden sm:block">
        <Sidebar />
      </aside>
      <main className="w-full sm:w-[80%] md:w-[85%] lg:w-[85%] p-4">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
