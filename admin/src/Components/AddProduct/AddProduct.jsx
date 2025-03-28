import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import { useState } from "react";

const AddProduct = () => {
  const [image, setimage] = useState(false);
  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setimage(file);
      setproductDetails((prevDetails) => ({
        ...prevDetails,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const [productDetails, setproductDetails] = useState({
    name: "",
    category: "women",
    image: "",
    new_price: "",
    old_price: "",
  });
  const changeHandler = (e) => {
    setproductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };
  const Add_product = async () => {
    let responseData;
    let product = productDetails;
    let formData = new FormData();
    formData.append("product", image);
    await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => (responseData = data));
    if (responseData.success) {
      product.image = responseData.image_url;
      await fetch("http://localhost:3000/addproducts", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.success) alert("Product added successfully");
          else alert("Product not added successfully");
        });
      if (responseData.success) {
        product.image = responseData.image_url; // Backend sends correct URL

        await fetch("http://localhost:3000/addproducts", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        })
          .then((resp) => resp.json())
          .then((data) => {
            if (data.success) alert("Product added successfully");
            else alert("Product not added successfully");
          });
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
          <option value="kid">kid</option>
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
      <button
        onClick={() => {
          Add_product();
        }}
        className="addproduct-button"
      >
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
