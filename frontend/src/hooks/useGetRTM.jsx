import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { messages } = useSelector((store) => store.chat);
  const { socket } = useSelector((store) => store.socket);

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      console.log("New message received:", newMessage);
      dispatch(setMessages([...messages, newMessage]));
    });

    socket?.on("deleteMessage", (messageId) => {
      console.log("Message deleted:", messageId);
      dispatch(setMessages(messages.filter((msg) => msg._id !== messageId)));
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("deleteMessage");
    };
  }, [messages, setMessages]);

  return null;
};

export default useGetRTM;
