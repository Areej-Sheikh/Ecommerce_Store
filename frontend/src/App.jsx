import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Shop from "./Pages/Shop";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import LoginSignup from "./Pages/LoginSignup";
import Footer from "./Components/Footer/Footer";
import men_banner from "./Components/Assets/banner_mens.png";
import women_banner from "./Components/Assets/banner_women.png";
import kids_banner from "./Components/Assets/banner_kids.png";

function App() {
  return (
    <div>
      {/* Wrap the application with BrowserRouter for routing */}
      <BrowserRouter>
        {/* Navbar component that appears on all pages */}
        <Navbar />

        {/* Define application routes */}
        <Routes>
          {/* Home page */}
          <Route path="/" element={<Shop />} />

          {/* Category pages with respective banners */}
          <Route
            path="/mens"
            element={<ShopCategory banner={men_banner} category="men" />}
          />
          <Route
            path="/womens"
            element={<ShopCategory banner={women_banner} category="women" />}
          />
          <Route
            path="/kid"
            element={<ShopCategory banner={kids_banner} category="kid" />}
          />

          {/* Product pages with dynamic productId parameter */}
          <Route path="/product" element={<Product />} />
          <Route path="/product/:productId" element={<Product />} />

          {/* Cart page */}
          <Route path="/cart" element={<Cart />} />

          {/* Login and Signup page */}
          <Route path="/login" element={<LoginSignup />} />
        </Routes>

        {/* Footer component that appears on all pages */}
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
