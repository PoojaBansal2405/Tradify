import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Tooltip, Grow } from "@mui/material";
import { Add, Check, Search } from "@mui/icons-material";

const Markets = ({ onStockAdded }) => {
    const [allStocks, setAllStocks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [addedStocks, setAddedStocks] = useState(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
                                                                                              
        const fetchStocks = axios.get("http://localhost:3002/allStocks");

                                                                                     
        const fetchWatchlist = axios.get("http://localhost:3002/watchlist", {
            withCredentials: true,
        });

        Promise.all([fetchStocks, fetchWatchlist])
            .then(([stocksRes, watchlistRes]) => {
                setAllStocks(stocksRes.data || []);
                const watchlistKeys = new Set(
                    (watchlistRes.data.stocks || []).map((stock) => stock.instrumentKey)
                );
                setAddedStocks(watchlistKeys);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching market data:", err);
                setLoading(false);
            });

            const handleSync = () =>{
                axios.get("http://localhost:3002/watchlist", {withCredentials: true})
                     .then((res)=>{
                        const keys = new Set((res.data.stocks || []).map((s)=> s.instrumentKey));
                        setAddedStocks(keys);
                     });
            };

            window.addEventListener("watchlistUpdated", handleSync);
            return ()=>window.removeEventListener("watchlistUpdated", handleSync);
    }, []);

    const handleAddToWatchlist = async (stock) => {
        try {
            await axios.post(
                "http://localhost:3002/watchlist/add",
                {
                    name: stock.name,
                    instrumentKey: stock.instrumentKey,
                    price: stock.price,
                    percent: stock.percent || "0.00%",
                    isDown: stock.isDown || false,
                },
                { withCredentials: true }
            );

            setAddedStocks((prev) => new Set(prev).add(stock.instrumentKey));
            toast.success(`${stock.name} added to watchlist!`);

            window.dispatchEvent(new Event("watchlistUpdated"));

            if (onStockAdded) {
                onStockAdded();
            }
        } catch (err) {
            console.error("Failed to add to watchlist:", err);
            toast.error(err.response?.data?.message || "Error adding stock to watchlist");
        }
    };

    const filteredStocks = allStocks.filter((stock) =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <h3 className="title">Loading market stocks...</h3>;
    }

    return (
        <div>
            <div style={{ marginBottom: "20px" }}>
                <h3 className="title">All Stocks Market Directory ({allStocks.length})</h3>
                <div style={{ display: "flex", alignItems: "center", position: "relative", maxWidth: "350px" }}>
                    <Search style={{ position: "absolute", left: "10px", color: "#888" }} />
                    <input
                        type="text"
                        placeholder="Search stock symbol..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px 10px 10px 38px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            outline: "none",
                            fontSize: "0.9rem"
                        }}
                    />
                </div>
            </div>

            <div className="order-table">
                <table>
                    <thead>
                        <tr>
                            <th>Stock Symbol</th>
                            <th>Base Price (₹)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStocks.length === 0 ? (
                            <tr>
                                <td colSpan="3" style={{ textAlign: "center", color: "#888", padding: "20px" }}>
                                    No stocks found matching "{searchTerm}"
                                </td>
                            </tr>
                        ) : (
                            filteredStocks.map((stock) => {
                                const isAdded = addedStocks.has(stock.instrumentKey);
                                return (
                                    <tr key={stock.instrumentKey}>
                                        <td>{stock.name}</td>
                                        <td>₹ {stock.price?.toFixed(2) ?? stock.price}</td>
                                        <td>
                                            <Tooltip
                                                title={isAdded ? "Already in Watchlist" : "Add to Watchlist"}
                                                placement="top"
                                                arrow
                                                TransitionComponent={Grow}
                                            >
                                                <button
                                                    onClick={() => handleAddToWatchlist(stock)}
                                                    disabled={isAdded}
                                                    className={isAdded ? "btn btn-grey" : "btn btn-blue"}
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: "4px",
                                                        cursor: isAdded ? "not-allowed" : "pointer",
                                                        opacity: isAdded ? 0.65 : 1,
                                                        fontSize: "0.8rem",
                                                        padding: "6px 14px",
                                                    }}
                                                >
                                                    {isAdded ? (
                                                        <>
                                                            <Check style={{ fontSize: "16px" }} /> Added
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Add style={{ fontSize: "16px" }} /> Add to Watchlist
                                                        </>
                                                    )}
                                                </button>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Markets;   
