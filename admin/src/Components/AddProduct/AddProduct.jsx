import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import { useState } from "react";

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "women",
    image: "",
    new_price: "",
    old_price: "",
  });

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const addProduct = async () => {
    let responseData;
    let product = productDetails;
    let formData = new FormData();
    formData.append("product", image);

    try {
      const uploadResponse = await fetch(
        `${import.meta.env.VITE_API_URL}upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        }
      );

      responseData = await uploadResponse.json();

      if (responseData.success) {
        product.image = responseData.image_url;

        const addProductResponse = await fetch(
          `${import.meta.env.VITE_API_URL}addproduct`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
          }
        );

        const result = await addProductResponse.json();
        alert(
          result.success
            ? "Product added successfully"
            : "Product not added successfully"
        );
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here..."
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type here..."
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type here..."
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="addproduct-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            alt="Product Thumbnail"
            className="addproduct-thumbnail-image"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <button onClick={addProduct} className="addproduct-button">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
