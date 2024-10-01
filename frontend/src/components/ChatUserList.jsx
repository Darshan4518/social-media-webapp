import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { setSelectedUser } from "@/redux/chatSlice";
import { Loader } from "lucide-react";

const ChatUserList = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [selectedUserTab, setSelectedUserTab] = useState();
  const { onlineUsers } = useSelector((store) => store.chat);

  const fetchSuggestedUsers = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/v1/user/suggestedusers",
      {
        withCredentials: true,
      }
    );
    return res.data.users;
  };

  const { isPending, data: suggestedUsers } = useQuery({
    queryKey: ["chatsuggestedUsers"],
    queryFn: fetchSuggestedUsers,
    staleTime: 60000,
  });

  const handleUserClick = (selectedUser) => {
    dispatch(setSelectedUser(selectedUser));
    setSelectedUserTab(selectedUser?._id);
  };

  return (
    <div className="w-[25%] h-screen border-r border-gray-400 px-3 py-6 hidden sm:block">
      <div className="flex items-center gap-x-4">
        <Avatar className="w-10 h-10 mx-auto md:mx-0">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>
            {user?.userName?.slice(0, 2)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-semibold hidden md:block">
          {user?.userName}
        </h3>
      </div>
      <div>
        <div className="flex items-center justify-between gap-x-3 my-4">
          <h3 className="font-bold text-md mx-auto md:mx-0">Messages</h3>
          <p className="font-bold text-md text-gray-500 hidden md:block">
            Requests
          </p>
        </div>
      </div>
      {isPending ? (
        <div className=" w-full h-full flex justify-center items-center">
          <Loader className=" animate-spin size-8" />
        </div>
      ) : (
        <ScrollArea>
          {suggestedUsers?.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser?._id}
                className={`flex items-center gap-x-4 ${
                  suggestedUser?._id === selectedUserTab
                    ? "bg-slate-100 rounded-lg"
                    : ""
                } my-3 cursor-pointer p-2`}
                onClick={() => handleUserClick(suggestedUser)}
              >
                <Avatar className="w-12 h-12 mx-auto md:mx-0">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>
                    {suggestedUser?.userName?.slice(0, 2)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-md font-bold  hidden md:block">
                    {suggestedUser?.userName}
                  </h3>
                  {isOnline ? (
                    <p className=" text-green-500  text-sm font-semibold  hidden md:block">
                      Online
                    </p>
                  ) : (
                    <p className=" text-red-600 text-sm font-semibold  hidden md:block">
                      Offline
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </ScrollArea>
      )}
    </div>
  );
};

export default ChatUserList;
