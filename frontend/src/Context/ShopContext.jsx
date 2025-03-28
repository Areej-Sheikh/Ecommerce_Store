import { createContext, useEffect, useState } from "react";

export const ShopContext = createContext({});

const ShopContextProvider = ({ children }) => {
  const [all_product, setAllProduct] = useState([]);
  const [cartItems, setCartItems] = useState({});

useEffect(() => {
  fetch("http://localhost:3000/allproducts")
    .then((response) => response.json())
    .then((data) => {
      setAllProduct(data.products);

      const token = localStorage.getItem("auth-token");

      console.log("Auth Token:", token); // ✅ Check if the token exists before making the request

      if (token) {
        fetch("http://localhost:3000/getcart", {
          method: "GET", // ✅ Correct method
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`, // ✅ Send token correctly
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Cart Data Response:", data); // ✅ Log response to check if it's correct

            if (data.success) {
              setCartItems(data.cartData);
            } else {
              console.error("Error fetching cart:", data.message);
            }
          })
          .catch((error) => console.error("Error fetching cart data:", error));
      } else {
        console.error("No auth token found in local storage"); // ✅ If token is missing, this will show
      }
    })
    .catch((error) => console.error("Error fetching products:", error));
}, []);


const addToCart = (itemId) => {
  const authToken = localStorage.getItem("auth-token");

  if (!authToken) {
    console.error("No auth token found! User might be logged out.");
    return;
  }

  console.log("Auth Token:", authToken); // Debugging log

  fetch("http://localhost:3000/addtocart", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "auth-token": authToken, // Ensuring token is included
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ itemId: itemId }),
  })
    .then((response) => {
      console.log("Raw response:", response);
      return response.json();
    })
    .then((data) => {
      console.log("Response data:", data);
      if (data.success) {
        setCartItems(data.cartData); // Ensure backend sends updated cart data
      } else {
        console.error("Failed to update cart:", data.message);
      }
    })
    .catch((error) => console.error("Error adding to cart:", error));
};

const removeFromCart = (itemId) => {
  const authToken = localStorage.getItem("auth-token");

  if (!authToken) {
    console.error("No auth token found! User might be logged out.");
    return;
  }

  console.log("Auth Token:", authToken);
  console.log("Item ID:", itemId);

  fetch("http://localhost:3000/removefromcart", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ itemId }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Remove Response Data:", data);

      if (data.success) {
        setCartItems(data.cartData); // ✅ Sync with backend data
      } else {
        console.error("Failed to remove item:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error removing item:", error);
    });
};



const getTotalCartAmount = () => {
  return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
    const product = all_product.find((p) => String(p.id) === String(itemId)); // ✅ Ensure both are strings
    return product ? total + product.new_price * quantity : total;
  }, 0);
};


  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce(
      (total, quantity) => total + quantity,
      0
    );
  };

  const contextValue = {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
  };

  return (
    <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
