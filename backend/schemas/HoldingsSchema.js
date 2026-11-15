const mongoose = require("mongoose");

const HoldingsSchema = new mongoose.Schema({
    name: String,
    qty: Number,
    avg: Number,
    price: Number,
    net: String,
    day: String,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    instrumentKey:{
        type:String,
        required:true,
    }

})

HoldingsSchema.index(
    {  instrumentKey: 1 ,
     userId: 1 },
     {unique: true}
);


module.exports = HoldingsSchema;