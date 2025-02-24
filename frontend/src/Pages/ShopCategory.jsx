import { useContext } from "react";
import "./CSS/ShopCategory.css";
import { ShopContext } from "../Context/ShopContext";
import dropdown from "../Components/Assets/dropdown_icon.png";
import Item from "../Components/Item/Item";
const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);

  return (
    <div className="shop-category">
      <img  className="shopcategory-banner" src={props.banner} alt="" />
      <div className="shopcategory-index-sort">
        <p>
          <span>Showing 1-12</span> Out Of 36 Products
        </p>
      <div className="shopcategory-sort">
        Sort By <img src={dropdown} alt="" />
      </div>
      </div>
      <div className="shopcategory-products">
        {all_product.map((item, i) => {
          if (props.category === item.category) {
            return (
              <Item
                key={i}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
      <div className="loadmore">
        Explore More
      </div>
    </div>
  );
};

export default ShopCategory;
