import react,{useState,useEffect} from 'react'
// import {holdings} from "../data/data"
import axios from 'axios'
import {BarChart} from './BarChart'
import { LIVE_PRICES_WS_URL } from "../config";
const Holdings = () => {

    const[allHoldings , setAllHoldings] = useState([]);
    const[livePrices,setLivePrices] = useState({});
    useEffect(()=>{
        axios.get('http://localhost:3002/allHoldings',{withCredentials:true}).then((res)=>{
            console.log(res.data);
            setAllHoldings(res.data);
        })
    },[])

    useEffect(()=>{
        const socket = new WebSocket(LIVE_PRICES_WS_URL);
        socket.onmessage=(event)=>{
            const updates = JSON.parse(event.data);
            setLivePrices((oldPrices)=>({
               ...oldPrices,
               ...updates,
            }))
        }

        return()=>{
            socket.close();
        }
    },[])

    const labels = allHoldings.map((subArray)=>subArray["name"]);

    const data={
        labels,
        datasets: [
            {
                label: "stock Price",
                data: allHoldings.map((stock) => livePrices[stock.instrumentKey]?.price??stock.price),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
         
        ],
    }

    const totalInvestment = allHoldings.reduce((total , stock)=>{
          return total+(stock.avg * stock.qty);
    },0)

    const currValue = allHoldings.reduce((total,stock)=>{
        const currPrice = livePrices[stock.instrumentKey]?.price??stock.price;

        return total+(currPrice)*stock.qty;
    },0)

    const totalPnL = currValue-totalInvestment;

    const totalPnLPercent =
        totalInvestment === 0
            ? 0
            : (totalPnL / totalInvestment) * 100;
    return (
        <>
            <h3 className="title">Holdings ({allHoldings.length})</h3>

            <div className="order-table">
                <table>
                    <tr>
                        <th>Instrument</th>
                        <th>Qty.</th>
                        <th>Avg. cost</th>
                        <th>LTP</th>
                        <th>Cur. val</th>
                        <th>P&L</th>
                        <th>Net chg.</th>
                        <th>Day chg.</th>
                    </tr>
                    {allHoldings.map((stock,index)=>{
                        let currPrice = livePrices[stock.instrumentKey]?.price??stock.price;
                        const curValue = currPrice * stock.qty;
                        const isProfit = curValue - stock.avg * stock.qty >=0.0;
                        const profClass = isProfit ? "profit":"loss";

                        const dayClass = stock.isLoss ?"loss":"profit";

                         return(
                             <tr key={index} >
                                 <td>{stock.name}</td>
                                 <td>{stock.qty}</td>
                                 <td>{stock.avg.toFixed(2)}</td>
                                 <td>{currPrice.toFixed(2)}</td>
                                 <td>{curValue.toFixed(2)}</td>
                                 <td className={profClass}>{(curValue-stock.avg*stock.qty).toFixed(2)}</td>
                                 <td className={profClass}>{stock.net}</td>
                                 <td className={dayClass}>{stock.day}</td>
                                 </tr>
                         )

                    })}

                   
                </table>

                <div className="row">
                    <div className="col">
                        <h5>
                            {totalInvestment.toFixed(2)}{" "}
                        </h5>
                        <p>Total Investment</p>
                    </div>
                    <div className="col">
                        <h5>
                           {currValue.toFixed(2)}{" "}
                        </h5>
                        <p>Current value</p>
                    </div>
                    <div className="col">
                        <h5>
                            {totalPnL.toFixed(2)}{" "}
                            ({totalPnLPercent.toFixed(2)}%)
                        </h5>
                        <p>P&L</p>
                    </div>
                </div>
                <BarChart data={data}/>
            </div>
        </>
    )
}

export default Holdings