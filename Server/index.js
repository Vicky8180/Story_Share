const express = require("express");
const app = express();
const db = require("./Config/db");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
dotenv.config();
db();

const allowedOrigins = [
  "http://localhost:3000",
  "https://share-story-x.vercel.app",

  "http://another-origin.com",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS,PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use("/api", require("./Router/routes"));

app.listen(PORT, () => {
  console.log(`Server is running on port no ${PORT}`);
});
