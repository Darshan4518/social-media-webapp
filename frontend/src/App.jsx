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

function App() {
  const { user } = useSelector((store) => store.auth);
  const { isConnected } = useSelector((store) => store.socket);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:5000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket", "polling"],
      });

      socketio.on("connect", () => {
        dispatch(setSocketState({ isConnected: true, userId: user._id }));
      });

      socketio.on("disconnect", () => {
        dispatch(setSocketState({ isConnected: false, userId: null }));
      });

      return () => {
        socketio.close();
        dispatch(setSocketState({ isConnected: false, userId: null }));
      };
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
