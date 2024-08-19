import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { MessageCircleCode } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import useGetAllMessages from "@/hooks/useGetAllMessages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const SelectedUserChat = () => {
  const dispatch = useDispatch();
  useGetAllMessages();
  const { messages } = useSelector((store) => store.chat);
  const [message, setMessage] = useState("");
  const { selectedUser } = useSelector((store) => store.chat);
  const [loading, setLoading] = useState(false);

  const messageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/message/send/${selectedUser?._id}`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages(res.data.messages));
        console.log(res.data.messages);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col max-h-screen w-full">
      {loading ? (
        <div className="flex justify-center items-center flex-grow">
          <CircularProgress />
        </div>
      ) : (
        <div className="flex flex-col flex-grow px-3 py-6 max-h-screen ">
          {selectedUser ? (
            <>
              <div className="flex items-center gap-x-4 border-b border-gray-400 pb-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedUser?.profilePicture} />
                  <AvatarFallback>
                    {selectedUser?.userName?.slice(0, 2)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">
                  {selectedUser?.userName}
                </h3>
              </div>
              <ScrollArea>
                <div className="my-10 flex flex-col items-center gap-y-2">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={selectedUser?.profilePicture} />
                    <AvatarFallback>
                      {selectedUser?.userName?.slice(0, 2)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">
                    {selectedUser?.userName}
                  </h3>
                  <Link to={`/profile/${selectedUser?._id}`}>
                    <Button variant="ghost" className="bg-slate-200 my-2 py-0">
                      View Profile
                    </Button>
                  </Link>
                </div>
                <div className=" flex-1 space-y-4">
                  {messages &&
                    messages?.map((message, ind) => {
                      return <p key={ind}>{message}</p>;
                    })}
                </div>
              </ScrollArea>
              <div className="flex flex-col flex-grow">
                <div className="flex items-center gap-x-4 mt-auto border-t border-gray-400 pt-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-grow border rounded-md px-2 py-4"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                  />
                  <Button className="ml-2" onClick={messageHandler}>
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center flex-grow">
              <MessageCircleCode size={80} />
              <p>Send a message to start a chat</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectedUserChat;
