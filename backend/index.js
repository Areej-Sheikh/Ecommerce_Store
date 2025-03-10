const port = 3000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

// require.env
require("dotenv").config();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
//mongodb+srv://areejfatimasheikh25:AreejMongoDB!P@ssw0rd@cluster0.iundj.mongodb.net/

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.get("/", function (req, res) {
  res.send("Hello World!");
});
app.listen(port, (error) => {
  if (error) {
    console.log("Error in connecting to database", error);
  } else {
    console.log("Server is running on port", port);
  }
});
