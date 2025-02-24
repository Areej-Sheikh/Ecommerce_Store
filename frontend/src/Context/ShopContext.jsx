import { createContext } from "react";
import all_product from "../Components/Assets/all_product";

export const ShopContext = createContext({});

const ShopContextProvider = (props) => {
  console.log("all_product data:", all_product);
  const contextValue = { all_product }; // Renaming it properly

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
export default ShopContextProvider;
