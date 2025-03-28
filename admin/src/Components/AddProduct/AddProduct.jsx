import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import { useState } from "react";

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "women",
    image: "",
    new_price: "",
    old_price: "",
  });

  // Handle file input change
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

  // Handle input changes for product details
  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  // Function to add product
  const addProduct = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    let responseData;
    let formData = new FormData();
    formData.append("product", image);

    // Upload image
    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
      responseData = await response.json();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
      return;
    }

    if (responseData.success) {
      const product = { ...productDetails, image: responseData.image_url };

      // Send product details to backend
      try {
        const productResponse = await fetch(
          "http://localhost:3000/addproduct",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
          }
        );
        const productData = await productResponse.json();

        if (productData.success) {
          alert("Product added successfully");
          setProductDetails({
            name: "",
            category: "women",
            image: "",
            new_price: "",
            old_price: "",
          });
          setImage(null);
        } else {
          alert("Product not added successfully");
        }
      } catch (error) {
        console.error("Error adding product:", error);
        alert("Failed to add product");
      }
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
          <option value="kid">Kids</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            alt=""
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
