import react,{useState,useEffect} from 'react'

import axios from 'axios';
import { LIVE_PRICES_WS_URL } from "../config";
const Positions = ()=>{
    const[allPositions, setAllPositions] = useState([]);
    const[livePrices , setLivePrices] = useState({});

    useEffect(()=>{
        const socket = new WebSocket(LIVE_PRICES_WS_URL);

        socket.onmessage = (event)=>{
            const updates = JSON.parse(event.data);
           
                setLivePrices((oldPrices)=>({
                    ...oldPrices,
                    ...updates,
                }))
            }

            return()=>{
                socket.close();
            }
        },[]
    )

    useEffect(()=>{
        axios.get("http://localhost:3002/AllPositions",{withCredentials:true}).then((res)=>{
            setAllPositions(res.data);
        })
    },[])
    return(
        <>
        
        <h3 className ="title">Positions ({allPositions.length})</h3>

        <div className="order-table">
            <table>
              <tr>
                        <th>Product</th>
                        <th>Instrument</th>
                        <th>Qty.</th>
                        <th>Avg.</th>
                        <th>LTP</th>
                        <th>P&L</th>
                        <th>Chg.</th>
              </tr>

              {allPositions.map((stock,index)=>{
                  const currentPrice =
                      livePrices[stock.instrumentKey]?.price ?? stock.price;
                   const curValue = stock.qty * currentPrice;
                   const isProfit = curValue-stock.qty * stock.avg>= 0.0;
                   
                   const profClass = isProfit ?"profit":"loss";
                  const dayClass = stock.isLoss ? "loss" : "profit";

                  return(<tr key={index}>
                      <td >{stock.product}</td >
                      <td >{stock.name}</td>
                      <td>{stock.qty}</td >
                      <td>{stock.avg.toFixed(2)}</td>
                      <td>{currentPrice.toFixed(2)}</td>
                     
                      <td className={profClass}>{(curValue - stock.avg * stock.qty).toFixed(2)}</td>
                      
                      <td className={dayClass}>{stock.day}</td>
                  </tr>
                  );
              })}
            </table>
        </div>
        </>
    )
}

export default Positions