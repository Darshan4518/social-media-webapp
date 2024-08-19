import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    isConnected: false,
    userId: null,
  },
  reducers: {
    setSocketState: (state, action) => {
      state.isConnected = action.payload.isConnected;
      state.userId = action.payload.userId;
    },
  },
});

export const { setSocketState } = socketSlice.actions;
export default socketSlice.reducer;
