const Story_Model = require("../Model/story_model");
const User_Model = require("../Model/user_model");
const Bookmark_Model = require("../Model//bookmark_model");
const mongoose = require("mongoose");

const bookmarked = async (req, res) => {
  try {
    const { storyId, slideNumber, userId } = req.body;
    // console.log("1")
    if (!storyId || !userId || slideNumber === undefined) {
      return res.status(400).json({
        success: false,
        message: "Required fields (storyId, userId, slideNumber) are missing",
      });
    }
    // console.log(2)
    const existingBookmark = await Bookmark_Model.findOne({
      storyId,
      slideNumber,
      userId,
    });

    // console.log(3)
    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: "This bookmark already exists for this user.",
      });
    }

    // console.log(4)

    const newBookmark = await Bookmark_Model.create({
      storyId,
      slideNumber,
      userId,
    });
    // console.log(5)

    await User_Model.findOneAndUpdate(
      { _id: userId },
      { $push: { bookmarks: newBookmark._id } }
    );

    // console.log(6)
    return res.status(201).json({
      success: true,
      message: "Bookmarked successfully.",
      data: newBookmark,
    });
  } catch (error) {
    console.error("Error in bookmarking:", error);
    return res.status(500).json({
      success: false,
      message: "Error in bookmarking",
      error: error.message,
    });
  }
};

const fetchBookmarks = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const data = await User_Model.findOne({ _id: userId }).populate({
      path: "bookmarks",
      populate: { path: "storyId" },
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bookmarks fetched successfully.",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching bookmarks.",
      error: error.message,
    });
  }
};

const UnBookmarked = async (req, res) => {
  try {
    const { storyId, slideNumber, userId } = req.body;

    if (!storyId || !userId || slideNumber === undefined) {
      return res.status(400).json({
        success: false,
        message: "StoryId, SlideNumber, or UserId is missing.",
      });
    }

    const bookmark = await Bookmark_Model.findOneAndDelete({
      storyId,
      slideNumber,
      userId,
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found.",
      });
    }

    const updatedUser = await User_Model.findOneAndUpdate(
      { _id: userId },
      { $pull: { bookmarks: bookmark._id } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found or failed to update.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Unbookmarked successfully.",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in unbookmarking.",
      error: error.message,
    });
  }
};

const liked = async (req, res) => {
  try {
    const { storyId, slideNumber, userId } = req.body;

    if (!storyId || slideNumber === undefined || !userId) {
      return res.status(400).json({
        success: false,
        message: "storyId, slideNumber, or userId is missing.",
      });
    }

    const storyData = await Story_Model.findOne({
      _id: storyId,
      [`each_slides.${slideNumber}`]: { $exists: true },
    });

    if (!storyData) {
      return res.status(404).json({
        success: false,
        message: "Story or slide not found.",
      });
    }

    const slide = storyData.each_slides[slideNumber];

    const alreadyLiked = slide.likedByUserArray.some(
      (like) => like.byUser.toString() === userId
    );

    if (alreadyLiked) {
      console.log(1);
      await Story_Model.findOneAndUpdate(
        { _id: storyId, [`each_slides.${slideNumber}`]: { $exists: true } },
        {
          $inc: { [`each_slides.${slideNumber}.likeCount`]: -1 },
          $pull: {
            [`each_slides.${slideNumber}.likedByUserArray`]: {
              byUser: new mongoose.Types.ObjectId(userId),
            },
          },
        },
        { new: true }
      );

      const updatedStoryData = await Story_Model.findById(storyId);
      return res.status(200).json({
        success: true,
        message: "Slide unliked successfully.",
        data: updatedStoryData,
        like: false,
      });
    } else {
      await Story_Model.findOneAndUpdate(
        { _id: storyId, [`each_slides.${slideNumber}`]: { $exists: true } },
        {
          $inc: { [`each_slides.${slideNumber}.likeCount`]: 1 },
          $addToSet: {
            [`each_slides.${slideNumber}.likedByUserArray`]: {
              byUser: new mongoose.Types.ObjectId(userId),
              sliderNumber: slideNumber,
            },
          },
        },
        { new: true }
      );

      const updatedStoryData = await Story_Model.findById(storyId);
      return res.status(200).json({
        success: true,
        message: "Slide liked successfully.",
        data: updatedStoryData,
        like: true,
      });
    }
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while processing like/unlike.",
      error: error.message,
    });
  }
};

const unliked = async (req, res) => {
  try {
    const { storyId, slideNumber, userId } = req.body;

    if (!storyId || slideNumber === undefined || !userId) {
      return res.status(400).json({
        success: false,
        message: "storyId, slideNumber, or userId is missing.",
      });
    }

    const storyData = await Story_Model.findOneAndUpdate(
      { _id: storyId, [`each_slides.${slideNumber}`]: { $exists: true } },
      {
        $inc: { [`each_slides.${slideNumber}.likeCount`]: -1 },
        $pull: { [`each_slides.${slideNumber}.likedByUserArray`]: userId },
      },
      { new: true }
    );

    if (!storyData) {
      return res.status(404).json({
        success: false,
        message: "Story or slide not found.",
      });
    }

    if (storyData.each_slides[slideNumber].likeCount < 0) {
      storyData.each_slides[slideNumber].likeCount = 0;
    }

    await storyData.save();

    return res.status(200).json({
      success: true,
      message: "Slide unliked successfully.",
      data: storyData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while unliking the slide.",
      error: error.message,
    });
  }
};

module.exports = { liked, unliked, bookmarked, UnBookmarked, fetchBookmarks };
