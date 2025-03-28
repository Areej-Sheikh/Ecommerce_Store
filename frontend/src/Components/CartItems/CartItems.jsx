import { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png"; // Importing remove icon

const CartItems = () => {
  // Extracting relevant state and functions from ShopContext
  const { all_product, cartItems, removeFromCart, getTotalCartAmount } =
    useContext(ShopContext);

  return (
    <div className="cart-item">
      {/* Header row for the cart table */}
      <div className="cart-item-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {/* Mapping through all products to find those in the cart */}
      {all_product.map((e) => {
        if (cartItems?.[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cart-item-format cart-item-format-main">
                {/* Product image */}
                <img
                  src={e.image}
                  alt={e.name}
                  className="carticon-product-icon"
                />
                {/* Product name */}
                <p>{e.name}</p>
                {/* Product price */}
                <p>${e.new_price}</p>
                {/* Display quantity */}
                <button className="cart-item-quantity">
                  {cartItems[e.id]}
                </button>
                {/* Total price for the item */}
                <p>${e.new_price * cartItems[e.id]}</p>
                {/* Remove button */}
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

      {/* Cart total and promo section */}
      <div className="cart-item-down">
        <div className="cart-item-total">
          <h1>Cart Total :</h1>
          <div>
            {/* Subtotal row */}
            <div className="cart-item-total-item">
              <p>SubTotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            {/* Shipping fee row */}
            <div className="cart-item-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            {/* Total amount row */}
            <div className="cart-item-total-item">
              <h3> Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
          </div>
          {/* Checkout button */}
          <button>PROCEED TO CHECKOUT</button>
        </div>

        {/* Promo code section */}
        <div className="cart-item-promo">
          <p>Have a promo code? Enter it here</p>
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
