const mongoose = require("mongoose");

const Share_Schema = new mongoose.Schema(
  {

    urlId: { type: String, required: true },
    storyData:{type:mongoose.Schema.Types.ObjectId, ref:'story'},
    slideNumber:{ type: Number, required: true }
  },
  { timestamps: true }
);

const Share_Model = new mongoose.model("share_url", Share_Schema);

module.exports = Share_Model;
