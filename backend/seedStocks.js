require("dotenv").config()
const mongoose = require("mongoose");
const StocksModel = require("./model/StocksModel");

const MONGO_URL = process.env.MONGO_URL;

const stockData = [
 
    { name: "RELIANCE", instrumentKey: "NSE_EQ|INE002A01018", price: 1313.20 },
    { name: "TCS", instrumentKey: "NSE_EQ|INE467B01029", price: 3500.00 },
    { name: "HDFCBANK", instrumentKey: "NSE_EQ|INE040A01034", price: 725.05 },
    { name: "ICICIBANK", instrumentKey: "NSE_EQ|INE090A01021", price: 1411.90 },
    { name: "BHARTIARTL", instrumentKey: "NSE_EQ|INE397D01024", price: 1941.70 },
    { name: "INFY", instrumentKey: "NSE_EQ|INE009A01021", price: 1130.00 },
    { name: "SBIN", instrumentKey: "NSE_EQ|INE062A01020", price: 1048.00 },
    { name: "L&T", instrumentKey: "NSE_EQ|INE018A01030", price: 4081.00 },
    { name: "ITC", instrumentKey: "NSE_EQ|INE154A01025", price: 270.80 },
    { name: "HINDUNILVR", instrumentKey: "NSE_EQ|INE030A01027", price: 2380.00 },
    { name: "AXISBANK", instrumentKey: "NSE_EQ|INE238A01034", price: 1251.00 },
    { name: "KOTAKBANK", instrumentKey: "NSE_EQ|INE237A01028", price: 397.65 },
    { name: "BAJFINANCE", instrumentKey: "NSE_EQ|INE296A01024", price: 1095.00 },
    { name: "M&M", instrumentKey: "NSE_EQ|INE101A01026", price: 2850.00 },
    { name: "MARUTI", instrumentKey: "NSE_EQ|INE585B01010", price: 11200.00 },
    { name: "SUNPHARMA", instrumentKey: "NSE_EQ|INE044A01036", price: 1710.00 },
    { name: "NTPC", instrumentKey: "NSE_EQ|INE733E01010", price: 338.85 },
    { name: "TATAMOTORS", instrumentKey: "NSE_EQ|INE155A01022", price: 477.90 },
    { name: "TATASTEEL", instrumentKey: "NSE_EQ|INE081A01020", price: 183.14 },
    { name: "POWERGRID", instrumentKey: "NSE_EQ|INE752E01010", price: 265.15 },
    { name: "HCLTECH", instrumentKey: "NSE_EQ|INE860A01027", price: 1580.00 },
    { name: "ASIANPAINT", instrumentKey: "NSE_EQ|INE021A01026", price: 2340.00 },
    { name: "COALINDIA", instrumentKey: "NSE_EQ|INE522F01014", price: 402.05 },
    { name: "BAJAJFINSV", instrumentKey: "NSE_EQ|INE918I01026", price: 1620.00 },
    { name: "TITAN", instrumentKey: "NSE_EQ|INE280A01028", price: 3210.00 },
    { name: "ULTRACEMCO", instrumentKey: "NSE_EQ|INE481G01011", price: 11150.00 },
    { name: "NESTLEIND", instrumentKey: "NSE_EQ|INE239A01024", price: 2210.00 },
    { name: "ONGC", instrumentKey: "NSE_EQ|INE213A01029", price: 238.50 },
    { name: "BEL", instrumentKey: "NSE_EQ|INE263A01024", price: 407.75 },
    { name: "GRASIM", instrumentKey: "NSE_EQ|INE047A01021", price: 2540.00 },
    { name: "WIPRO", instrumentKey: "NSE_EQ|INE075A01022", price: 181.15 },
    { name: "ADANIENT", instrumentKey: "NSE_EQ|INE423A01024", price: 2994.90 },
    { name: "ADANIPORTS", instrumentKey: "NSE_EQ|INE742F01042", price: 1210.00 },
    { name: "JSWSTEEL", instrumentKey: "NSE_EQ|INE019A01038", price: 920.00 },
    { name: "TECHM", instrumentKey: "NSE_EQ|INE669C01036", price: 1650.00 },
    { name: "HDFCLIFE", instrumentKey: "NSE_EQ|INE795G01014", price: 680.00 },
    { name: "SBILIFE", instrumentKey: "NSE_EQ|INE123W01016", price: 1540.00 },
    { name: "DRREDDY", instrumentKey: "NSE_EQ|INE089A01023", price: 1240.00 },
    { name: "BPCL", instrumentKey: "NSE_EQ|INE029A01011", price: 295.00 },
    { name: "EICHERMOT", instrumentKey: "NSE_EQ|INE066A01021", price: 4890.00 },
    { name: "HINDALCO", instrumentKey: "NSE_EQ|INE038A01020", price: 645.00 },
    { name: "TATACONSUM", instrumentKey: "NSE_EQ|INE192A01025", price: 980.00 },
    { name: "BRITANNIA", instrumentKey: "NSE_EQ|INE216A01030", price: 4920.00 },
    { name: "CIPLA", instrumentKey: "NSE_EQ|INE059A01026", price: 1480.00 },
    { name: "APOLLOHOSP", instrumentKey: "NSE_EQ|INE437A01024", price: 6850.00 },
    { name: "DIVISLAB", instrumentKey: "NSE_EQ|INE361B01024", price: 5890.00 },
    { name: "HEROMOTOCO", instrumentKey: "NSE_EQ|INE158A01026", price: 4320.00 },
    { name: "SHRIRAMFIN", instrumentKey: "NSE_EQ|INE721A01013", price: 3120.00 },
    { name: "TRENT", instrumentKey: "NSE_EQ|INE849A01020", price: 6310.00 },
    { name: "BAJAJ-AUTO", instrumentKey: "NSE_EQ|INE917I01010", price: 8940.00 }
];


async function seedDatabase(){
    try{
        await mongoose.connect(MONGO_URL);
        console.log("mongo connected");

        await StocksModel.deleteMany({});

        await StocksModel.insertMany(stockData);
        await mongoose.connection.close();
        
    }catch(error){
        console.error("Error",error);
        process.exit(1);
    }
}

seedDatabase();