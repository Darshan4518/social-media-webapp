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
import { setMessages, setSelectedUser } from "@/redux/chatSlice";
import useGetRTM from "@/hooks/useGetRTM";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Sheet, SheetContent } from "./ui/sheet";

const SelectedUserChat = () => {
  const dispatch = useDispatch();
  useGetRTM();
  useGetAllMessages();

  const { messages } = useSelector((store) => store.chat);
  const { user, suggestedUsers } = useSelector((store) => store.auth);
  const { selectedUser } = useSelector((store) => store.chat);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [selectedUserTab, setSelectedUserTab] = useState();
  const { onlineUsers } = useSelector((store) => store.chat);

  const handleUserClick = (selectedUser) => {
    dispatch(setSelectedUser(selectedUser));
    setSelectedUserTab(selectedUser?._id);
  };

  const messageHandler = async () => {
    setLoading(true);
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
        dispatch(setMessages([...messages, res.data.newMessage]));
        setMessage("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLongPress = (message) => {
    if (message.senderId === user?._id) {
      setSelectedMessageId(message._id);
      setDialogOpen(true);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedMessageId(null);
  };

  const deleteMessage = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/v1/message/delete/${selectedMessageId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(
          setMessages(messages.filter((msg) => msg._id !== selectedMessageId))
        );
        handleClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col max-h-screen w-full p-4 md:p-6">
      {loading ? (
        <div className="flex justify-center items-center flex-grow">
          <CircularProgress />
        </div>
      ) : (
        <div className="flex flex-col flex-grow max-h-screen">
          {selectedUser ? (
            <>
              <div className="flex items-center justify-between border-b border-gray-400 pb-3">
                <Button
                  variant="ghost"
                  className="sm:hidden border  border-gray-200"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Chat List
                </Button>
                <div className="flex items-center gap-x-2 md:gap-x-4 ">
                  <Avatar className="w-8 h-8 md:w-10 md:h-10">
                    <AvatarImage src={selectedUser?.profilePicture} />
                    <AvatarFallback>
                      {selectedUser?.userName?.slice(0, 2)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg md:text-xl font-semibold">
                    {selectedUser?.userName}
                  </h3>
                </div>
              </div>
              <ScrollArea className="mt-6">
                <div className="flex flex-col items-center gap-y-2">
                  <Avatar className="w-12 h-12 md:w-24 md:h-24">
                    <AvatarImage src={selectedUser?.profilePicture} />
                    <AvatarFallback>
                      {selectedUser?.userName?.slice(0, 2)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-md md:text-xl font-semibold">
                    {selectedUser?.userName}
                  </h3>
                  <Link to={`/profile/${selectedUser?._id}`}>
                    <Button
                      variant="ghost"
                      className="bg-slate-200 my-2 py-1 w-[100px] h-[30px] text-[12px] md:text-base"
                    >
                      View Profile
                    </Button>
                  </Link>
                </div>
                <div className="flex-1 space-y-4 my-3">
                  {messages &&
                    messages.map((message, ind) => (
                      <div
                        key={ind}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          handleLongPress(message);
                        }}
                        className={`flex ${
                          message.senderId === user?._id
                            ? "justify-end mx-6 md:mx-10"
                            : "justify-start"
                        }`}
                      >
                        <p
                          className={`max-w-xs p-2 break-words px-4 text-[10px] sm:text-base ${
                            message.senderId === user?._id
                              ? "bg-green-600 text-white font-bold rounded-es-lg rounded-se-lg"
                              : "bg-slate-200 text-gray-500 font-bold rounded-es-lg rounded-se-lg"
                          }`}
                        >
                          {message.message}
                        </p>
                      </div>
                    ))}
                </div>
              </ScrollArea>
              <div className="flex flex-col flex-grow">
                <div className="flex items-center gap-x-2 md:gap-x-4 mt-auto border-t border-gray-400 pt-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-grow border rounded-md px-2 py-3 text-sm md:text-base"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                  />
                  <Button
                    className="ml-2"
                    onClick={messageHandler}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={20} /> : "Send"}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center flex-grow">
              <MessageCircleCode size={64} className="md:size-80" />
              <p className="text-sm md:text-base">
                Send a message to start a chat
              </p>
            </div>
          )}
        </div>
      )}

      {/* Dialog for delete confirmation */}
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Delete Message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this message? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={deleteMessage} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Sheet open={open}>
        <SheetContent
          className="w-[200px] sm:hidden"
          onInteractOutside={() => {
            setOpen(false);
          }}
          side="left"
        >
          <ScrollArea>
            {suggestedUsers?.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id);
              return (
                <div>
                  <div
                    key={suggestedUser?._id}
                    className={`flex items-center gap-x-4 ${
                      suggestedUser?._id === selectedUserTab
                        ? "bg-slate-100 rounded-lg"
                        : ""
                    } my-3 cursor-pointer p-2 `}
                    onClick={() => handleUserClick(suggestedUser)}
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={suggestedUser?.profilePicture} />
                      <AvatarFallback>
                        {suggestedUser?.userName?.slice(0, 2)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-md font-bold ">
                        {suggestedUser?.userName}
                      </h3>
                      {isOnline ? (
                        <p className=" text-green-500  text-sm font-semibold ">
                          Online
                        </p>
                      ) : (
                        <p className=" text-red-600 text-sm font-semibold ">
                          Offline
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SelectedUserChat;
