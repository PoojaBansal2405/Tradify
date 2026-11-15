import React,{useState , useContext , useEffect} from "react";

import {Tooltip, Grow} from '@mui/material';
import axios from 'axios';
import { toast} from "react-toastify"
import GeneralContext from './Generalcontext'
import {BarChartOutlined, Delete ,MoreHoriz,KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material"
import {DoughnutChart} from './DoughnutChart.js'
import { LIVE_PRICES_WS_URL } from "../config";
const WatchList = () => {
    const [watchList , setWatchList] = useState([]);
    const [stockPrices , setStockPrices] = useState({});
    const [searchTerm , setSearchTerm] = useState("");
    const [searchResults , setSearchResults] = useState([]);
    const [isSearching , setIsSearching] = useState(false);

    useEffect(()=>{
       axios.get("http://localhost:3002/watchlist" , {withCredentials: true})
       .then((res)=>{
           setWatchList(res.data.stocks || []);
       })
       .catch((err)=>{
        console.log("error:",err);
       })
    },[])

    useEffect(()=>{
        axios.get("http://localhost:3002/livePrices")
        .then((res)=>{
            setStockPrices(res.data);
        })
        .catch((err)=>{
            console.log("error",err);
        })
    },[])
    

    useEffect(()=>{
     const socket = new WebSocket(LIVE_PRICES_WS_URL);
     socket.onopen = () =>{
        console.log("connected to backend websocket");
     };

     socket.onmessage = (event)=>{
        const updates = JSON.parse(event.data);
         console.log("Received from backend:", updates);
       setStockPrices((oldPrices)=>{
        return{
          ...oldPrices,
          ...updates,
        }
       });
     }

     socket.onerror = (error)=>{
        console.log("Websocket error",error);
     }

     return()=>{
        socket.close();
     }
    },[])


    useEffect(()=>{
       if(!searchTerm.trim()){
        setSearchResults([]);
        setIsSearching(false);
        return;
       }

       setIsSearching(true);

       const delayDebouceFn = setTimeout(()=>{
        axios.get(`http://localhost:3002/searchStocks?query=${encodeURIComponent(searchTerm)}`)
          .then((res)=>{
            setSearchResults(res.data);
          })
          .catch((err)=> console.error("Search Error",err));
       },300);

       return ()=> clearTimeout(delayDebouceFn);
    },[searchTerm]);

    const handleRemoveFromWatchlist = async(instrumentKey) =>{
        try{
            await axios.delete(`http://localhost:3002/watchlist/remove/${encodeURIComponent(instrumentKey)}` , {
                withCredentials:true,
            });
            setWatchList((prev) => prev.filter((stock)=> stock.instrumentKey !== instrumentKey));
            toast.success("Stock removed from watchlist");

            window.dispatchEvent(new Event("watchlistUpdated"));
        }catch(err){
            console.error("Error removing stock from watchlist", err);
            toast.error(err.response?.data?.message || "Failed to remove stock");   
        }
    };

    useEffect(()=>{
        const handleSync = () => {
            axios.get("http://localhost:3002/watchlist", {withCredentials: true})
                .then((res)=> setWatchList(res.data.stocks || []));
        };

        window.addEventListener("watchlistUpdated", handleSync);
        return() => window.removeEventListener("watchlistUpdated" , handleSync);
    },[])

    const displayedStocks = isSearching ? searchResults : watchList;
    const labels = watchList.map((subArray)=>subArray["name"]);
     const data = {
        labels,
        datasets: [
            {
                label: "Stock Price",
                data: watchList.map((stock)=>stock.price),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    return (
        <div className="watchlist-container">
            <div className="search-container">
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
                    className="search"
                    value={searchTerm}
                    onChange={(e)=>setSearchTerm(e.target.value)}
                />
                <span className="counts"> {displayedStocks.length} / {isSearching ? "Results" : "50"}</span>
            </div>

            <ul className = "list">
                {displayedStocks.length === 0 && isSearching ? (
                    <li className="no-results" style={{padding:"12px" , color: '#888'}}>
                        No stocks found matching "{searchTerm}"
                    </li>
                ) : (
                    displayedStocks.map((stock,index) => (
                        <WatchListItem stock ={stock}
                        stockPrices={stockPrices}
                        key={stock.instrumentKey || index }
                        onRemoveStock={handleRemoveFromWatchlist}
                        />
                    ))
                )}
                </ul>
            

            <DoughnutChart data={data}/>
        </div>
    );
};

export default WatchList;

const WatchListItem = ({stock,stockPrices, onRemoveStock}) =>{
   const liveData = stockPrices[stock.instrumentKey];
   const currentPrice = liveData?.price ?? stock.price;
   const percentChange = liveData?.percent ?? stock.percent ?? "0.00";
   const isDown = liveData?.isDown ?? stock.isDown ?? false;

    const [showWatchlistActions, setShowWatchlistActions] = useState(false);
    const handleMouseEnter = (e)=>{
       setShowWatchlistActions(true);
    }

    const handleMouseLeave = (e) =>{
        setShowWatchlistActions(false);
    }

    return(
      
        <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
           <div className="item">
                <p className={isDown ?"down":"up"}>{stock.name}</p>
          
           <div className="itemInfo">
              <span className="percent">{percentChange}</span>
                    {isDown ? (
                <KeyboardArrowDown className="down"/>
              ):( <KeyboardArrowUp className="up"/>
              )}
              <span className="price">{currentPrice}</span>
           </div>
            </div>
            {showWatchlistActions && <WatchListActions uid={stock.name} price={currentPrice}    instrumentKey={stock.instrumentKey} 
            onRemove={()=> onRemoveStock(stock.instrumentKey)}/>}
        </li>
    )
}


const WatchListActions = ({uid,price,instrumentKey, onRemove})=>{
    const generalContext = useContext(GeneralContext);
    return(
        <span className="actions">
            <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
                <button className="buy action" onClick={() => generalContext.openBuyWindow(uid, price, instrumentKey)}>Buy</button>

            </Tooltip>

            <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
                <button className="sell action" onClick={() => generalContext.openSellWindow(uid, price, instrumentKey)}>Sell</button>

            </Tooltip>

            <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}>
                <button className="action">
               <BarChartOutlined className="icon"/>
                </button>

            </Tooltip>

            <Tooltip title="Remove (Delete)" placement="top" arrow TransitionComponent={Grow}>
                <button className="action" onClick={onRemove}>
                    <Delete className="icon" />
                </button>

            </Tooltip>

            <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
                <button className="action">
                    <MoreHoriz className="icon"/></button>

            </Tooltip>
        </span>
    )
}