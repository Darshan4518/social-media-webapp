import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";
import Chat from "./pages/Chat";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocketState } from "./redux/soketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotify } from "./redux/rtmLikeSlice";

function App() {
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const socketio = io("https://instagram-olwk.onrender.com", {
        query: { userId: user._id },
        transports: ["websocket"],
      });

      // Dispatch socket state
      dispatch(setSocketState(socketio));

      // Event listeners
      const handleGetOnlineUser = (onlineUser) => {
        dispatch(setOnlineUsers(onlineUser));
      };
      const handleNotification = (notification) => {
        dispatch(setLikeNotify(notification));
      };

      socketio.on("getOnlineUser", handleGetOnlineUser);
      socketio.on("notification", handleNotification);

      // Cleanup function
      return () => {
        socketio.off("getOnlineUser", handleGetOnlineUser);
        socketio.off("notification", handleNotification);
        socketio.close();
        dispatch(setSocketState(null));
      };
    } else {
      // Close socket and cleanup if user logs out or becomes null
      socket?.close();
      dispatch(setSocketState(null));
    }
  }, [user, dispatch, socket]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
