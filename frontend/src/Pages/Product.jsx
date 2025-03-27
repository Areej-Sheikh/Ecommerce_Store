import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../Components/Breadcrumbs/Breadcrumbs";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";

const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();

  // Wait until products are loaded
  if (!all_product || all_product.length === 0) {
    return <p>Loading products...</p>;
  }

  const product = all_product.find((e) => e.id === productId);

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div>
      <Breadcrumbs product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProducts />
    </div>
  );
};

export default Product;
