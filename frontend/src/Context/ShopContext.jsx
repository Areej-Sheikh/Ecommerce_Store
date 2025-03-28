import { createContext, useEffect, useState } from "react";

// Creating a context for the shop
export const ShopContext = createContext({});

const ShopContextProvider = ({ children }) => {
  const [all_product, setAllProduct] = useState([]); // State to store all products
  const [cartItems, setCartItems] = useState({}); // State to store items in the cart

  useEffect(() => {
    // Fetch all products from the backend
    fetch("http://localhost:3000/allproducts")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch products");
        return response.json();
      })
      .then((data) => setAllProduct(data.products))
      .catch((error) => console.error("Error fetching products:", error));

    // Fetch cart data if the user is authenticated
    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch("http://localhost:3000/getcart", {
        method: "POST", // Using POST to match backend API
        headers: {
          Accept: "application/json",
          "auth-token": authToken,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch cart");
          return response.json();
        })
        .then((data) => {
          if (data.cartData) {
            setCartItems(data.cartData);
          }
        })
        .catch((error) => console.error("Error fetching cart:", error));
    }
  }, []); // Runs only once when the component mounts

  // Function to add an item to the cart
  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch("http://localhost:3000/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      })
        .then((response) => {
          const contentType = response.headers.get("Content-Type");
          if (contentType && contentType.includes("application/json")) {
            return response.json();
          }
          return response.text();
        })
        .then((data) => console.log("Cart Updated:", data))
        .catch((error) => console.error("Error adding to cart:", error));
    }
  };

  // Function to remove an item from the cart
  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updatedCart = {
        ...prev,
        [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
      };
      if (updatedCart[itemId] === 0) delete updatedCart[itemId]; // Remove item if quantity is 0
      return updatedCart;
    });

    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch("http://localhost:3000/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log("Cart Updated:", data))
        .catch((error) => console.error("Error removing from cart:", error));
    }
  };

  // Function to calculate the total cart amount
  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const product = all_product.find((p) => p.id === Number(itemId));
      return product ? total + product.new_price * quantity : total;
    }, 0);
  };

  // Function to get the total number of items in the cart
  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce(
      (total, quantity) => total + quantity,
      0
    );
  };

  // Context value object containing state and functions
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
