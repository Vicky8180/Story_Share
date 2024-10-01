const mongoose = require("mongoose");

const Bookmark_Schema = new mongoose.Schema(
  {
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: "story" },
    slideNumber: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const Bookmark_Model = new mongoose.model("bookmark", Bookmark_Schema);

module.exports = Bookmark_Model;
