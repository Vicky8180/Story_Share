import { createSlice } from "@reduxjs/toolkit";

const traversedSlice = createSlice({
  name: "traversed",
  initialState: {
    traversed: [],
  },
  reducers: {
    addItem: (state, action) => {
      if (!state.traversed.includes(action.payload)) {
        state.traversed.push(action.payload);
      }
    },

    resetItems: (state) => {
      state.traversed = [];
    },
  },
});

export const { addItem, resetItems } = traversedSlice.actions;

export default traversedSlice.reducer;
