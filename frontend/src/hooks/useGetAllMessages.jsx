import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

const useGetAllMessages = () => {
  const { selectedUser } = useSelector((store) => store.chat);

  const dispatch = useDispatch();
  const fetchAllMessages = async () => {
    try {
      const res = await axios.get(
        `https://instagram-olwk.onrender.com/api/v1/message/all/${selectedUser?._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.status == 200) {
        dispatch(setMessages(res.data.messages));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAllMessages();
  }, [selectedUser]);
};

export default useGetAllMessages;
