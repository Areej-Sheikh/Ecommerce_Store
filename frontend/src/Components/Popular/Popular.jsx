import './Popular.css'
import Item from "../Item/Item"
import { useEffect, useState } from 'react'
const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([])
 useEffect(() => {
   fetch(`${import.meta.env.VITE_API_URL}popularinwomen`)
     .then((response) => response.json())
     .then((data) => {
       setPopularProducts(data);
     })
     .catch((error) => console.log(error));
 }, []);

  return (
    <div className="popular" >
        <h1>POPULAR IN WOMEN</h1>
        <hr />
        <div className="popular-item">
            {popularProducts.map((item,i)=>{
                return <Item key={i} id={item.id} name ={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
            })}
        </div>
    </div>
  )
}

export default Popular