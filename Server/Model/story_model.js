const mongoose = require("mongoose");

const Story_Schema = new mongoose.Schema(
  {
    heading: { type: String, required: true },
    description: { type: String, required: true },
    each_slides: [
      {
        heading: { type: String, required: true },
        description: { type: String, required: true },
        link: { type: String },
        likeCount: { type: Number, default: 0 },
        likedByUserArray: [
          {
            byUser: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            sliderNumber: { type: Number, require: true },
          },
        ],
        duration: { type: Number, default: 5 },
        mediaType: { type: String, default: "" },
        bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      },
    ],
    thumbnail: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2018/02/15/19/07/sunset-3156100_640.jpg",
      required: true,
    },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const Story_Model = new mongoose.model("story", Story_Schema);

module.exports = Story_Model;
