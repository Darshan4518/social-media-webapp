import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setOnlineUsers, setSocket } from "../redux/chatSlice"; // Adjust the path if needed

const useSocket = () => {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketIo = io("https://instagram-olwk.onrender.com", {
        transports: ["websocket", "polling"],
        query: { userId: user._id },
      });

      dispatch(setSocket(socketIo));

      socketIo.on("getOnlineUser", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      return () => {
        socketIo.close();
        dispatch(setSocket(null));
      };
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [user, dispatch, socket]);
};

export default useSocket;
