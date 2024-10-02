import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    followUser: (state, action) => {
      const { userId } = action.payload;

      if (!state.user.following.includes(userId)) {
        state.user.following.push(userId);
        state.user.followerCount += 1;
      }
    },
    unfollowUser: (state, action) => {
      const { userId } = action.payload;

      if (state.user.following.includes(userId)) {
        state.user.following = state.user.following.filter(
          (id) => id !== userId
        );
        state.user.followerCount -= 1;
      }
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
  },
});

export const {
  setAuthUser,
  followUser,
  unfollowUser,
  suggestedUsers,
  setSuggestedUsers,
} = authSlice.actions;

export default authSlice.reducer;
