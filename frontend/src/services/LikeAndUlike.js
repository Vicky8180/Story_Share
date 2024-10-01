import axios from "axios";

const LikeService = {
  fetchLikes: async (userId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL_PORT}/api/story/fetch/likes`,
        { userId }
      );
      return response.data.data.likes;
    } catch (error) {

      throw error;
    }
  },

  isLiked: (likeData, storyId, slideNumber, userId) => {
    return likeData.some((like) => {
      return (
        like.storyId === storyId &&
        like.slideNumber === slideNumber &&
        like.userId === userId
      );
    });
  },

  likeSlide: async (storyId, slideNumber, userId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL_PORT}/api/story/like`,
        { storyId, slideNumber, userId }
      );
      return response.data;
    } catch (error) {
      console.error("Error liking the slide", error);
      throw error;
    }
  },

  unlikeSlide: async (storyId, slideNumber, userId) => {
    try {
      const response = await axios.post(
       `${process.env.REACT_APP_BASE_URL_PORT}/api/story/unlike`,
        { storyId, slideNumber, userId }
      );
      return response.data;
    } catch (error) {
      console.error("Error unliking the slide", error);
      throw error;
    }
  },
};

export default LikeService;
