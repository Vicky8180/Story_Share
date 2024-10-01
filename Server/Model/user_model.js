const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User_Schema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "bookmark" }],
    your_stories: [{ type: mongoose.Schema.Types.ObjectId, ref: "story" }],
  },
  { timestamps: true }
);

User_Schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

User_Schema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User_Model = new mongoose.model("user", User_Schema);

module.exports = User_Model;
