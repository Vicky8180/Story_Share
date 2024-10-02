const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User_Model = require("../Model/user_model");
const app = express();

dotenv.config();

app.use(cookieParser());

const Register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExist = await User_Model.find({ username });
    if (userExist.length > 0) {
      return res
        .status(409)
        .json({ message: "User Already Exist", error: "", data: "" });
    }

    const user = new User_Model({ username, password });
    const savedUser = await user.save();

    const userWithPopulatedData = await User_Model.findById(savedUser._id)
      .populate({
        path: "your_stories",
      })
      .populate({
        path: "bookmarks",
      });

    const payload = { userId: savedUser._id.toString() };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "8h",
    });

    return res.status(200).json({
      message: "Registered Successfully",
      error: "",
      data: userWithPopulatedData,
      token: token,
    });
  } catch (error) {
    return res
      .status(400)
      .json({
        message: "Error in registering user",
        error: error.message,
        data: "",
      });
  }
};

const Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExist = await User_Model.findOne({ username })
      .populate({
        path: "your_stories",
      })
      .populate({
        path: "bookmarks",
      });

    if (!userExist) {
      return res
        .status(404)
        .json({ message: "User Not Exist", error: "", data: "" });
    }

    const isMatch = await userExist.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", error: "", data: "" });
    }

    const payload = { userId: userExist._id.toString() };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "8h",
    });

    return res.status(200).json({
      message: "Successful Login",
      error: "",
      data: userExist,
      token: token,
    });
    // },2000)
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
      error: error.message,
      data: "",
    });
  }
};

module.exports = { Register, Login };
