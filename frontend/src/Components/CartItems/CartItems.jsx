import { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
  const { all_product, cartItems, removeFromCart,getTotalCartAmount } = useContext(ShopContext);

  return (
    <div className="cart-item">
      <div className="cart-item-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((e) => {
        if (cartItems?.[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cart-item-format cart-item-format-main">
                <img
                  src={e.image}
                  alt={e.name}
                  className="carticon-product-icon"
                />
                <p>{e.name}</p>
                <p>${e.new_price}</p>
                <button className="cart-item-quantity">
                  {cartItems[e.id]}
                </button>
                <p>${e.new_price * cartItems[e.id]}</p>
                <img
                  className="cart-item-remove-icon"
                  src={remove_icon}
                  onClick={() => removeFromCart(e.id)}
                  alt="Remove"
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}
      <div className="cart-item-down">
        <div className="cart-item-total">
          <h1>Cart Total :</h1>
          <div>
            <div className="cart-item-total-item">
              <p>SubTotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-item-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cart-item-total-item">
              <h3> Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
          </div>
          <button>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-item-promo">
          <p>
            Have a promo code? Enter it here
          </p>
          <div className="cart-item-promo-box">
            <input type="text" placeholder="Enter Promo Code" />
            <button>APPLY</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
