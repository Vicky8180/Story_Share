import { configureStore } from '@reduxjs/toolkit';
import traversedReducer from './slices/TraversedSlice'; 
import eachSlideSlice from "./slices/EachSlideSlice"
import LoggedIn from './slices/LoggedIn';
import StoryByCategory from './slices/StoryByCategory';
const store = configureStore({
  reducer: {
    traversed: traversedReducer, 
    each_slides:eachSlideSlice,
    loggedin:LoggedIn,
    storyByCategory:StoryByCategory
  },
});

export default store;
