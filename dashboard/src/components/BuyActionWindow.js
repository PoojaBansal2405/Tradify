import React, {useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
import GeneralContext from './Generalcontext'


import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, price, instrumentKey })=>{
   const [stockQuantity , setStockQuantity] = useState(1);
  const [error,setError] = useState("");
    const generalContext = useContext(GeneralContext);
    const marginRequired = stockQuantity * price;
   const handleBuyClick = () =>{
       if (stockQuantity <= 0) {
           toast.error("Quantity should be greater than 0");
           return;
       }
    axios.post("http://localhost:3002/newOrder",{
        name:uid,
        instrumentKey: instrumentKey,
        qty: stockQuantity,
        price: price,
        mode:"BUY",
    },{
        withCredentials:true
    })
        .then((res) => {
            toast.success("Buy order successful!");
            generalContext.closeBuyWindow();
        })
        .catch((err) => {
            toast.error(
                err.response?.data?.message || "Buy order failed"
            );

        });

    
   };

const handleCancelClick = () =>{
    generalContext.closeBuyWindow();
}

return(
    <div className="container" id="buy-window" draggable="true">
        <div className="regular-order">
            <div className="inputs">
                <fieldset>
                    <legend>Qty.</legend>
                    <input type="number" name="qty" id="qty"  min="1" onChange={(e)=>setStockQuantity(Number(e.target.value))} value={stockQuantity}/>
                </fieldset>
                <fieldset>
                    <legend>Price</legend>
                    <input type="number" name="price" id="price"value={price||0} readOnly/>
                </fieldset>
            </div>
        </div>

        <div className="buttons">
            <span>Margin required {marginRequired}</span>
        <div>
                <button
                    className="btn btn-blue"
                    onClick={handleBuyClick}
                >
                    Buy
                </button>
        <Link to="" className="btn btn-grey" onClick={handleCancelClick}>Cancel</Link>
    </div>
    </div>
    </div>
)


};

export default BuyActionWindow;