import { createSlice } from "@reduxjs/toolkit";

const eachSlideSlice = createSlice({
  name: "each_slides",
  initialState: {
    each_slides: [],
  },
  reducers: {
    addItem: (state, action) => {
      state.each_slides = action.payload;
    },
  },
});

export const { addItem, resetItems } = eachSlideSlice.actions;
export default eachSlideSlice.reducer;
