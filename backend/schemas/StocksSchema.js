const mongoose = require("mongoose");

const StocksSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    instrumentKey: {
        type:String,
        required:true,
       
    },
    price: {
        type:Number,
        required:true,
    },
    percent: String,
    isDown: Boolean,
})

StocksSchema.index(
    { instrumentKey: 1 },
    { unique: true }
);


module.exports = StocksSchema;