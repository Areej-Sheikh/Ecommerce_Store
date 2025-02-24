import "./Breadcrumbs.css";
import arrow from "../Assets/breadcrum_arrow.png"
const Breadcrumbs = (props) => {
    const {product}=props;
  return <div className="breadcrumb">
    HOME <img src={arrow} alt="" /> SHOP<img src={arrow} alt="" />{product.category}<img src={arrow} alt="" />{product.name}
  </div>;
};

export default Breadcrumbs;
