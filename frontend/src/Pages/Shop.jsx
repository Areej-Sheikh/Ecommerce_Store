import Hero from "../Components/Hero/Hero";
import NewCollections from "../Components/NewCollections/NewCollections";
import Newsletter from "../Components/Newsletter/Newsletter";
import Offers from "../Components/Offers/Offers";
import Popular from "../Components/Popular/Popular";

const Shop = () => {
  return <div>
    <Hero/>
    <Popular/>
    <Offers/>
    <NewCollections/>
    <Newsletter/>
  </div>;
};

export default Shop;
