import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
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
      const socketio = io("http://localhost:5000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocketState(socketio));

      socketio.on("getOnlineUser", (onlineUser) => {
        dispatch(setOnlineUsers(onlineUser));
      });
      socketio.on("notification", (notification) => {
        dispatch(setLikeNotify(notification));
      });
      return () => {
        socketio.close();
        dispatch(setSocketState(null));
      };
    } else {
      socket?.close();
      dispatch(setSocketState(null));
    }
  }, [user, dispatch]);

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
