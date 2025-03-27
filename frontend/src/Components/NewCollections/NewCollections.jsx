import "./NewCollections.css";
import Item from "../Item/Item";
import { useEffect, useState } from "react";

const NewCollections = () => {
  const [newcollections, setNewCollections] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/newcollections")
      .then((response) => response.json())
      .then((data) => {
        setNewCollections(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="newCollections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {newcollections.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NewCollections;
