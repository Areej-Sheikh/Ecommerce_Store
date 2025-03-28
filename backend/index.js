const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
// app.use(cors());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use("/images", express.static("uploads/images"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Multer storage configuration for image uploads
const storage = multer.diskStorage({
  destination: "./uploads/images/",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage });

// Product Schema
const ProductSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});
const Product = mongoose.model("Product", ProductSchema);

// Add new product
app.post("/addproduct", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ success: true, message: "Product saved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving product" });
  }
});

// Remove product
app.post("/removeproduct", async (req, res) => {
  try {
    const deletedProduct =
      (await Product.findOneAndDelete({ id: req.body.id })) ||
      (await Product.findOneAndDelete({ _id: req.body.id }));
    if (!deletedProduct)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
});

// Get all products
app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching products" });
  }
});

// Upload product image
app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file)
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded." });
  res.json({
    success: true,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
  date: { type: Date, default: Date.now },
});
const Users = mongoose.model("Users", UserSchema);

// User Signup
app.post("/signup", async (req, res) => {
  if (await Users.findOne({ email: req.body.email })) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists" });
  }
  const user = new Users({ ...req.body, cartData: {} });
  await user.save();
  const token = jwt.sign(
    { user: { id: user.id } },
    process.env.JWT_SECRET || "default_secret"
  );
  res.json({ success: true, token });
});

// User Login
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed" });
  }
  if (user.password !== req.body.password) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed" });
  }
  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, process.env.JWT_SECRET || "default_secret");
  res.json({ success: true, token: token });
});
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let newCollection = products.slice(1).slice(-8);
  console.log("New collection Fetched");
  res.send(newCollection);
});
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  console.log("Popular products in women fetched");
  res.send(popular_in_women);
});
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Please Login using valid email id" });
  } else {
    try {
      const data = jwt.verify(
        token,
        process.env.JWT_SECRET || "default_secret"
      );
      req.user = data.user;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Please Login using valid email id" });
    }
  }
};
app.post("/addtocart", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Added to cart");
});
app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});

app.listen(process.env.PORT || 5000, (error) => {
  if (error) {
    console.log("Error in connecting to database", error);
  } else {
    console.log("Server is running on port : ", process.env.PORT);
  }
});
