import "./Hero.css";
import arrow_icon from "../Assets/arrow.png";
import hero_image from "../Assets/hero_image.png"
const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-left">
        <h2>NEW ARRIVALS ONLY</h2>
        <div>
          <div className="hero-hand-icon">
            <p id="new" >New</p>
            <p id="coll" >Collections</p>
            <p>For Everyone</p>
          </div>
          <div className="hero-latest-btn">
            <div>Latest Collections</div>
            <img src={arrow_icon} alt="" />
          </div>
        </div>
      </div>
      <div className="hero-right">
        <img src={hero_image} alt="" />
      </div>
    </div>
  );
};

export default Hero;
