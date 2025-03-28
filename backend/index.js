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
app.use(cors());
// app.use(cors({ origin: process.env.FRONTEND_URL }));
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
  const user = await Users.findOne({ email: req.body.email });
  if (!user || user.password !== req.body.password) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed" });
  }
  const token = jwt.sign(
    { user: { id: user.id } },
    process.env.JWT_SECRET || "default_secret"
  );
  res.json({ success: true, token });
});

// Middleware to authenticate user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token)
    return res.status(401).json({ success: false, message: "Please login" });
  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    ).user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Add item to cart
app.post("/addtocart", fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  user.cartData[req.body.itemId] = (user.cartData[req.body.itemId] || 0) + 1;
  await user.save();
  res.send("Added to cart");
});

// Remove item from cart
app.post("/removefromcart", fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  if (user.cartData[req.body.itemId] > 0) user.cartData[req.body.itemId] -= 1;
  await user.save();
  res.send("Removed from cart");
});

// Get user cart data
app.post("/getcart", fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  res.json(user.cartData);
});

// Get new collections (latest 8 products)
app.get("/newcollections", async (req, res) => {
  const products = await Product.find({}).sort({ date: -1 }).limit(8);
  res.json(products);
});

// Get popular products in women's category
app.get("/popularinwomen", async (req, res) => {
  const products = await Product.find({ category: "women" }).limit(4);
  res.json(products);
});

// Start server
app.listen(process.env.PORT, () =>
  console.log(`Server running on port: ${port}`)
);
