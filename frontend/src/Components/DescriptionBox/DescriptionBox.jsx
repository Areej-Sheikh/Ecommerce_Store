import "./DescriptionBox.css";

const DescriptionBox = () => {
  return <div className="descriptiobox">
    <div className="descriptiobox-navigator">
        <div className="descriptiobox-nav-box">Description</div>
        <div className="descriptiobox-nav-box fade">Reviews (125)</div>
    </div>
    <div className="descriptiobox-description">
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam vitae nemo omnis ipsam at reprehenderit! Eos dolorum perspiciatis voluptate aspernatur temporibus assumenda sequi illum, laudantium alias repudiandae culpa dolor voluptatem accusamus. Vero, error et nostrum adipisci nesciunt exercitationem cupiditate officiis. </p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo laborum voluptatem tempore deserunt unde, ratione porro is soluta numquam!</p>
    </div>
  </div>;
};

export default DescriptionBox;
