const express = require("express");
const Story_Model = require("../Model/story_model");
const User_Model = require("../Model/user_model");
const Bookmakr_Model = require("../Model//bookmark_model");




const createStory = async (req, res) => {
  const { storyArray, user_id } = req.body;
  if (!Array.isArray(storyArray) || storyArray.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid or empty story provided.",
    });
  }
  try {
    const { heading, description, category } = storyArray[0];
    if (!heading || !description || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Heading, description, and category are required in the first slide.",
      });
    }
    var thumbnail = "";

    for (let i = 0; i < storyArray.length; i++) {
      console.log("1");
      if (storyArray[i].mediaType === "image") {
        console.log(2);
        thumbnail = storyArray[i].link;
        break;
      }
    }

    storyArray.forEach((item) => {
      if (item.duration === null) {
        item.duration = 5;
      }
    });
    const data = await Story_Model.create({
      heading,
      description,
      each_slides: storyArray,
      category,
      thumbnail,
    });

    const user_data = await User_Model.findOneAndUpdate(
      { _id: user_id },
      { $push: { your_stories: data._id } }
    );

    return res.status(201).json({
      success: true,
      message: "Story created successfully.",
      data,
    });
  } catch (error) {
    console.error("Error creating story:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the story.",
      error: error.message,
    });
  }
};









const fetchStory = async (req, res) => {
  const { userId } = req.query;

  try {
    const data = await Story_Model.aggregate([
      {
        $group: {
          _id: "$category",
          stories: {
            $push: {
              _id: "$_id",
              heading: "$heading",
              description: "$description",
              each_slides: "$each_slides",
              thumbnail: "$thumbnail",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          stories: 1,
        },
      },
    ]);

    let stories = [];

    if (userId && userId !== "null") {
      try {
        const userData = await User_Model.findOne(
          { _id: userId },
          { your_stories: 1 }
        ).populate({ path: "your_stories" });

        if (userData) {
          stories = userData.your_stories;
        }
        return res.status(200).json({ success: true, data, stories });
      } catch (userError) {
        console.error("Error fetching user stories:", userError);
        return res
          .status(400)
          .json({
            success: false,
            message: "Error fetching user stories",
            error: userError,
          });
      }
    }

    return res.status(200).json({ success: true, data, stories: [] });
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};








const updateStory = async (req, res) => {
  const { story_id, storyArray } = req.body;

  if (!Array.isArray(storyArray) || storyArray.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid or empty story provided.",
    });
  }

  try {
    const { heading, description, category } = storyArray[0];
    if (!heading || !description || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Heading, description, and category are required in the first slide.",
      });
    }

    let thumbnail = "";
    for (let i = 0; i < storyArray.length; i++) {
      if (storyArray[i].mediaType === "image") {
        thumbnail = storyArray[i].link;
        break;
      }
    }

    storyArray.forEach((item) => {
      if (item.duration === null) {
        item.duration = 5;
      }
    });

    const updatedStory = await Story_Model.findByIdAndUpdate(
      { _id: story_id },
      {
        heading,
        description,
        each_slides: storyArray,
        category,
        thumbnail,
      },
      { new: true }
    );

    console.log(updateStory);
    if (!updatedStory) {
      return res.status(404).json({
        success: false,
        message: "Story not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Story updated successfully.",
      data: updatedStory,
    });
  } catch (error) {
    console.error("Error updating story:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the story.",
      error: error.message,
    });
  }
};

module.exports = { createStory, fetchStory, updateStory };
