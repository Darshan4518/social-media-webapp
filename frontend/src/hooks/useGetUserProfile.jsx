import { setUseProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchuggestedUsers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/user/${userId}/profile`,
          { withCredentials: true }
        );
        if (res.status === 200) {
          dispatch(setUseProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchuggestedUsers();
  }, [userId]);
};

export default useGetUserProfile;
