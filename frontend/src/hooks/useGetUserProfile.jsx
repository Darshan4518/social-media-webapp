import { setUseProfile } from "@/redux/authSlice";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/user/${userId}/profile`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        dispatch(setUseProfile(res.data.user));
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setError("Failed to load user profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [userId, dispatch]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return { fetchUserProfile, loading, error };
};

export default useGetUserProfile;
