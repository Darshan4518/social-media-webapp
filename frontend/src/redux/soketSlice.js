import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
  },
  reducers: {
    setSocketState: (state, action) => {
      state.socket = action.payload;
    },
  },
});

export const { setSocketState } = socketSlice.actions;
export default socketSlice.reducer;
