import "./Breadcrumbs.css"; // Importing styles for breadcrumbs
import arrow from "../Assets/breadcrum_arrow.png"; // Importing arrow icon for navigation display

const Breadcrumbs = (props) => {
  const { product } = props; // Destructuring product from props

  return (
    <div className="breadcrumb">
      {/* Static breadcrumb trail starting with Home and Shop */}
      HOME <img src={arrow} alt="" /> SHOP
      <img src={arrow} alt="" />
      {/* Displaying product category */}
      {product.category}
      <img src={arrow} alt="" />
      {/* Displaying product name */}
      {product.name}
      {/* Redundant fallback display (if category or name is missing) */}
      {product?.category || "Unknown Category"} <img src={arrow} alt="" />{" "}
      {product?.name || "Unknown Product"}
    </div>
  );
};

export default Breadcrumbs;
