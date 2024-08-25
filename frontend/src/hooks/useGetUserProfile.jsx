import { setUseProfile } from "@/redux/authSlice";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://instagram-olwk.onrender.com/api/v1/user/${userId}/profile`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        dispatch(setUseProfile(res.data.user));
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, dispatch]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return { fetchUserProfile, loading };
};

export default useGetUserProfile;
