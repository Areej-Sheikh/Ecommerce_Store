import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from "../Assets/nav_dropdown.png";

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("auth-token")
  );

  const dropdownToggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("auth-token");
    setIsAuthenticated(false);
    window.location.replace("/");
  };

  useEffect(() => {
    console.log("Checking auth token:", localStorage.getItem("auth-token"));
    setIsAuthenticated(!!localStorage.getItem("auth-token"));
  }, []);

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="" />
        <p>FOREVER 21</p>
      </div>
      <img
        className="nav-dropdown"
        onClick={dropdownToggle}
        src={nav_dropdown}
        alt=""
      />
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
            kid
          </Link>
          {menu === "kid" && <hr />}
        </li>
      </ul>
      <div className="nav-login-cart">
        {isAuthenticated ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}

        <Link to="/cart">
          <img src={cart_icon} alt="" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
