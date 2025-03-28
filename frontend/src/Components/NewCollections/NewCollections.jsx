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

      {/* Show message if no collections are available */}
      {newcollections.length === 0 ? (
        <p className="no-collections">No new collections available.</p>
      ) : (
        <div className="collections">
          {newcollections.map((item) => (
            <Item
              key={item._id} // Use MongoDB's `_id` as the key
              id={item._id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewCollections;
