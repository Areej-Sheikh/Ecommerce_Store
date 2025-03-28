import { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  // Fetch all products from the backend
  const fetchInfo = async () => {
    try {
      const resp = await fetch("http://localhost:3000/allproducts");
      const data = await resp.json();
      setAllProducts(Array.isArray(data.products) ? data.products : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAllProducts([]);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  // Remove a product by ID
  const remove_product = async (id) => {
    try {
      const response = await fetch("http://localhost:3000/removeproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (result.success) {
        // Update state by filtering out the deleted product
        setAllProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
      } else {
        console.error("Failed to delete product:", result.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="list-product">
      <h1>All Products</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="list-product-allproducts">
        <hr />
        {allproducts.map((product) => (
          <div key={product.id}>
            <div className="listproduct-format-main listproduct-format">
              <img
                src={product.image}
                alt={product.name}
                className="listproduct-product-icon"
              />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img
                className="listproduct-remove-icon"
                src={cross_icon}
                onClick={() => remove_product(product.id)}
                alt="Remove"
              />
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
