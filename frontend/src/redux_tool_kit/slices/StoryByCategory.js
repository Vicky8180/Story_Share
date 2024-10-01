import { createSlice } from "@reduxjs/toolkit";

const storyByCategorySlice = createSlice({
  name: "storyByCategory",
  initialState: {
    storyByCategory: [],
  },
  reducers: {
    addItems: (state, action) => {
      state.storyByCategory = action.payload;
    },
    removeItems: (state, action) => {
      const idsToRemove = action.payload.map((item) => item._id);
      state.storyByCategory = state.storyByCategory.filter(
        (item) => !idsToRemove.includes(item._id)
      );
    },
    resetItems: (state) => {
      state.storyByCategory = [];
    },
  },
});

export const { addItems, removeItems, resetItems } =
  storyByCategorySlice.actions;
export default storyByCategorySlice.reducer;
