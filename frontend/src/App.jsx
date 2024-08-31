import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";
import Chat from "./pages/Chat";
import { io } from "socket.io-client";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotify } from "./redux/rtmLikeSlice";
import { setConnectionId, setSocketConnectionStatus } from "./redux/soketSlice";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      const socketio = io("https://instagram-olwk.onrender.com", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });

      socketRef.current = socketio;

      dispatch(setSocketConnectionStatus(true));
      dispatch(setConnectionId(user?._id));

      socketio.on("getOnlineUser", (onlineUser) => {
        dispatch(setOnlineUsers(onlineUser));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotify(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocketConnectionStatus(false));
        dispatch(setConnectionId(null));
        socketRef.current = null;
      };
    } else if (socketRef.current) {
      socketRef.current.close();
      dispatch(setSocketConnectionStatus(false));
      dispatch(setConnectionId(null));
      socketRef.current = null;
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
