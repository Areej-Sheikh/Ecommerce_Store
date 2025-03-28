import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from "../Assets/nav_dropdown.png";

const Navbar = () => {
  const [menu, setMenu] = useState("shop"); // State to track active menu item
  const { getTotalCartItems } = useContext(ShopContext); // Get cart items count from context
  const menuRef = useRef(); // Reference for dropdown menu

  // State to check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("auth-token")
  );

  // Function to toggle dropdown menu visibility
  const dropdownToggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  // Function to handle user logout
  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("auth-token"); // Remove auth token
    setIsAuthenticated(false); // Update authentication state
    window.location.replace("/"); // Redirect to home
  };

  // Effect to check authentication state when component mounts
  useEffect(() => {
    console.log("Checking auth token:", localStorage.getItem("auth-token"));
    setIsAuthenticated(!!localStorage.getItem("auth-token"));
  }, []);

  return (
    <div className="navbar">
      {/* Logo Section */}
      <div className="nav-logo">
        <img src={logo} alt="Brand Logo" />
        <p>FOREVER 21</p>
      </div>

      {/* Dropdown menu icon for mobile */}
      <img
        className="nav-dropdown"
        onClick={dropdownToggle}
        src={nav_dropdown}
        alt="Dropdown Menu"
      />

      {/* Navigation Menu */}
      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => setMenu("shop")}>
          <Link style={{ textDecoration: "none", color: "black" }} to="/">
            Shop
          </Link>
          {menu === "shop" && <hr />}
        </li>
        <li onClick={() => setMenu("mens")}>
          <Link style={{ textDecoration: "none", color: "black" }} to="/mens">
            Men
          </Link>
          {menu === "mens" && <hr />}
        </li>
        <li onClick={() => setMenu("womens")}>
          <Link style={{ textDecoration: "none", color: "black" }} to="/womens">
            Women
          </Link>
          {menu === "womens" && <hr />}
        </li>
        <li onClick={() => setMenu("kid")}>
          <Link style={{ textDecoration: "none", color: "black" }} to="/kid">
            Kids
          </Link>
          {menu === "kid" && <hr />}
        </li>
      </ul>

      {/* Login/Logout and Cart Section */}
      <div className="nav-login-cart">
        {/* Show logout button if authenticated, otherwise show login */}
        {isAuthenticated ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}

        {/* Cart Icon */}
        <Link to="/cart">
          <img src={cart_icon} alt="Cart" />
        </Link>

        {/* Display total cart items count */}
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
