const OrdersModel = require("../model/OrdersModel");
 const {buyStock,sellStock} = require("../Services/TradingService");
 
 const OrderController = async(req,res)=>{
    try {
    if (req.body.mode == "BUY") {
        await buyStock(req.body, req.user.id);
    } else if (req.body.mode == "SELL") {
        await sellStock(req.body, req.user.id);
    }else{
        return res.status(400).json({message: "Invalid order mode. Must be Buy or Sell."})
    }

    res.json({
        message: "Order placed Successfully."
    })
} catch (err) {
    res.status(400).json({
        message: err.message
    });
}
 }

 module.exports = {OrderController};