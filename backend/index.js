const port = 3000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
// require.env
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/images", express.static("uploads/images"));

// Connect to MongoDB

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((error) => console.error("MongoDB connection error:", error));

const storage = multer.diskStorage({
  destination: "./uploads/images/",
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

//schema for creating products

const ProductSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: uuidv4 },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

const Product = mongoose.model("Product", ProductSchema);
app.post("/addproduct", async function (req, res) {
  try {
    const product = new Product({
      id: uuidv4(),
      name: req.body.name,
      image: req.body.image, // Store full URL
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    await product.save();
    console.log("Product saved:", product);
    console.log("Received product data:", req.body);
    res.json({
      success: true,
      message: "Product saved successfully",
      name: req.body.name,
    });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ success: false, message: "Error saving product" });
  }
});
app.post("/removeproduct", async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.body.id });

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
      name: deletedProduct.name,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
});
app.get("/allproducts", async (req, res) => {
  try {
    let products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching products" });
  }
});
const upload = multer({ storage: storage });
app.use("/images", express.static("./uploads/images"));
app.post("/upload", upload.single("product"), function (req, res) {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded." });
  }
  res.json({
    success: true,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
  console.log("File uploaded:", req.file);
});

// Schema for user model
const Users = mongoose.model("Users", {
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
});

// registering the user
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists" });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  let user = new Users({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, process.env.JWT_SECRET || "default_secret");
  res.json({ success: true, token: token });
});

// logging in the user

app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });

  if (!user || user.password !== req.body.password) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed" });
  }

  const token = jwt.sign(
    { user: { id: user.id } },
    process.env.JWT_SECRET || "default_secret"
  );

  res.json({ success: true, token: token, cartData: user.cartData || {} });
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
const fetchUser = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    // Extract the token after "Bearer "
    const token = authHeader.split(" ")[1];
    console.log("Extracted token:", token); // Debug log to check the token value

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token format" });
    }

    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    );
    console.log("Verified Token:", verified); // Log the decoded token for debugging
    req.user = verified.user;
    next();
  } catch (error) {
    console.error("Token verification error:", error); // Log detailed error
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};



app.post("/addtocart", fetchUser, async (req, res) => {
  try {
    let userData = await Users.findOne({ _id: req.user.id });

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cart = userData.cartData || {}; // Ensure cart is an object

    // If item is already in cart, increase count; otherwise, add it
    cart[req.body.itemId] = (cart[req.body.itemId] || 0) + 1;

    // Save updated cart back to database
    await Users.updateOne({ _id: req.user.id }, { cartData: cart });

    res.json({ success: true, cartData: cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Error updating cart" });
  }
});


app.get("/getcart", fetchUser, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "User not found in token" });
    }

    const userId = req.user.id;
    const user = await Users.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      cartData: user.cartData || {}, // ✅ Ensure cartData is always an object
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  const { itemId } = req.body;

  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "User not found in token" });
    }

    const userId = req.user.id;
    const user = await Users.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.cartData || typeof user.cartData !== "object") {
      user.cartData = {}; // Ensure cartData is always an object
    }

    if (user.cartData.hasOwnProperty(itemId)) {
      delete user.cartData[itemId]; // Remove item from cart
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Item not found in cart" });
    }

    await user.markModified("cartData"); // ✅ Mark cartData as modified
    await user.save(); // ✅ Ensure it saves to MongoDB

    console.log("Updated Cart Data:", user.cartData); // Debugging log

    res.json({
      success: true,
      message: "Item removed from cart successfully",
      cartData: { ...user.cartData }, // Send updated cart data
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});






app.listen(port, (error) => {
  if (error) {
    console.log("Error in connecting to database", error);
  } else {
    console.log("Server is running on port : ", port);
  }
});
