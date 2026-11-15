process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL;
const cors = require('cors');
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const OrderRoutes = require("./Routes/OrderRoutes");
const PortfolioRoutes = require("./Routes/PortfolioRoutes");
const WalletRoutes = require("./Routes/WalletRoutes");
const WatchlistRoute = require("./Routes/WatchlistRoute");
 const { livePrices } = require("./Websocket/socketServer"); 

const app = express();



app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"]
}));
app.use(cookieParser());
app.use(express.json());

app.use("/", authRoute);
app.use("/",OrderRoutes);
app.use("/", PortfolioRoutes);
app.use("/", WalletRoutes);
app.use("/" , WatchlistRoute);

mongoose
    .connect(url)


    .then(() => {
        console.log("MongoDB Connected");

        app.listen(PORT, () => {
            console.log("app started on port", PORT);
        });
    })
    .catch((err)=>{
        console.log("error",err);
    })

    app.get("/livePrices",(req,res)=>{
        res.json(livePrices);
    })


