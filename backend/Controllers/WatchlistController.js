const WatchlistModel = require("../model/WatchlistModel");
const {subscribeToStock} = require("../Websocket/socketServer");
const getWatchlist = async(req,res)=>{
    try{
        const watchlist = await WatchlistModel.findOne({userId : req.user.id});
        if(!watchlist){
            return res.status(200).json({stocks: []});
        }
        if(watchlist.stocks && watchlist.stocks.length > 0){
            watchlist.stocks.forEach((stock)=>{
                if(stock.instrumentKey){
                    subscribeToStock(stock.instrumentKey);
                }
            });
        }
        res.status(200).json(watchlist);
    }
    catch(err){
       res.status(500).json({
        message: err.message
       });
    }
}

const addToWatchlist = async(req,res)=>{
    try{
   const {name , instrumentKey , price , percent , isDown} = req.body;

   if(!name || !instrumentKey){
    return res.status(400).json({message : "Name and instrumentKey are required"});
   }

   const existing = await WatchlistModel.findOne({
    userId:req.user.id || req.user._id,
    
    "stocks.instrumentKey":instrumentKey,
   })

   if(existing){
    return res.status(400).json({message : "Stock already in watchlist"});
   }

   const updatedWatchlist = await WatchlistModel.findOneAndUpdate(
    {userId:req.user.id ||req.user._id },
    {
        $push:{
            stocks: {name , instrumentKey , price , percent , isDown},
        },
    },
    {upsert:true , new:true}
   );
   subscribeToStock(instrumentKey);

   res.status(200).json({message : "Stock added successfully" , watchlist: updatedWatchlist});
}
catch(err){
    res.status(500).json({message: err.message});
}
}

const removeFromWatchlist = async(req,res)=>{
    try{
        const {instrumentKey} = req.params;
       

        const updatedWatchlist = await WatchlistModel.findOneAndUpdate(
            {userId: req.user.id || req.user._id },
            {
                $pull: {
                    stocks: {instrumentKey: instrumentKey},
                }
            },
            {new:true}
        );

        res.status(200).json({message: "Stock removed successfully" , watchlist: updatedWatchlist});
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

module.exports = {
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
}