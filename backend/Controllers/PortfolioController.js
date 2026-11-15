const StocksModel = require("../model/StocksModel");
const OrdersModel = require("../model/OrdersModel");
const HoldingsModel = require("../model/HoldingsModel");
const PositionsModel = require("../model/PositionsModel");
const { subscribeToStock } = require("../Websocket/socketServer");   
const getAllStocks = async (req, res) => {
    try {
        const allStocks = await StocksModel.find({});

        res.json(allStocks);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


const getAllOrders = async (req, res) => {
    try {
        const allOrders = await OrdersModel.find({
            userId: req.user.id
        });

        res.json(allOrders);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


const getAllHoldings = async (req, res) => {
    try {
        const allHoldings = await HoldingsModel.find({
            userId: req.user.id
        });

        res.json(allHoldings);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const getAllPositions = async (req, res) => {
    try{
    let allPositions = await PositionsModel.find({

        userId: req.user.id,
    })
        res.json(allPositions);
    }catch(err){
        res.status(500).json({
            message: err.message
        });
    }
    };

    //search stocks by name or instrument key
    const searchStocks = async(req,res)=>{
           try{
            const {query} = req.query;

            if(!query || query.trim() === ""){
                return res.json([]);
            }

            //case-innsensitive search using MongoDB regex
            const results = await StocksModel.find({
                name:{$regex: query.trim(), $options: "i"}
            }).limit(10); 
            
            results.forEach((stock)=>{
                if(stock.instrumentKey){
                    subscribeToStock(stock.instrumentKey);
                }
            });
            //limilt tp top 10 results for high performance
            res.status(200).json(results);
        }catch(err){
            res.status(500).json({
                message: err.message
            });
        }
    };


module.exports = {
    getAllStocks,
    getAllOrders,
    getAllHoldings,
    getAllPositions,
    searchStocks
};