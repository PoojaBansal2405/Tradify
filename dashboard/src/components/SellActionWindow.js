import react ,{useState,useContext} from 'react'
import './SellActionWindow.css'
import {Link} from 'react-router-dom'
import axios from 'axios'
import GeneralContext from './Generalcontext'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SellActionWindow = ({ uid, price, instrumentKey })=>{
const[stockQuantity , setStockQuantity] = useState(1);

const generalContext = useContext(GeneralContext);
    const marginRequired = stockQuantity * price;

const handleSellClick = ()=>{
    if (stockQuantity <= 0) {
           toast.error("Quantity should be greater than 0")
        return;
    }
  axios.post("http://localhost:3002/newOrder",{
    name:uid,
    instrumentKey:instrumentKey,
    qty: stockQuantity,
    price:price,
    mode:"SELL"
  },{
    withCredentials:true
  })
  .then((res)=>{
    toast.success("Sell order successful!");
    generalContext.closeSellWindow();
  })
  .catch((err)=>{
    toast.error(
                    err.response?.data?.message || "Sell order failed"
                );
  })
}


const handleCancelClick=()=>{
    generalContext.closeSellWindow();
}

return(
    <div className="container" id="sell-window" draggable="true">
        <div className="regular-order">
            <div className="inputs">
                <fieldset>
                    <legend>Qty.</legend>
                    <input type="number" name="val" id="val" min="1"  onChange={(e)=>setStockQuantity(Number(e.target.value))} value={stockQuantity}/>
                </fieldset>
                <fieldset>
                    <legend>Price</legend>
                    <input type="number" name="price" id="price"  value={price||0} readOnly/>
                </fieldset>
            </div>
        </div>

        <div className="buttons">
                    <span>Margin required {marginRequired}</span>
        <div>
                <button
                    className="btn btn-blue"
                    onClick={handleSellClick}
                >
                    Sell
                </button>
                <Link to="" className="btn btn-grey" onClick={handleCancelClick}>Cancel</Link>
       </div>
       </div>
    </div>

)
}

export default SellActionWindow;