import { createContext, useEffect, useState } from "react";

// Creating a context for the shop
export const ShopContext = createContext({});

const ShopContextProvider = ({ children }) => {
  const [all_product, setAllProduct] = useState([]); // State to store all products
  const [cartItems, setCartItems] = useState({}); // State to store items in the cart

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}allproducts`)
      .then((response) => response.json())
      .then((data) => {
        setAllProduct(data.products);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);


 const addToCart = (itemId) => {
   setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

   if (localStorage.getItem("auth-token")) {
     fetch(`${import.meta.env.VITE_API_URL}addtocart`, {
       method: "POST",
       headers: {
         Accept: "application/json",
         "auth-token": localStorage.getItem("auth-token"),
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ itemId: itemId }),
     })
       .then((response) => {
         // Check if the response has a JSON content type
         const contentType = response.headers.get("Content-Type");
         if (contentType && contentType.includes("application/json")) {
           return response.json();
         }
         // Otherwise, return the text response
         return response.text();
       })
       .then((data) => console.log(data))
       .catch((error) => console.error("Error adding to cart:", error));
   }
 };



  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));
  };

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
