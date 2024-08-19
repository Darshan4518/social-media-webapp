import React from "react";
import MainLayout from "./MainLayout";
import ChatUserList from "@/components/ChatUserList";
import SelectedUserChat from "@/components/SelectedUserChat";

const Chat = () => {
  return (
    <MainLayout>
      <section className=" w-full max-h-screen flex">
        <ChatUserList />
        <SelectedUserChat />
      </section>
    </MainLayout>
  );
};

export default Chat;
