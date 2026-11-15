const mongoose = require("mongoose");

const WatchlistSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
   
    stocks:[
    {
        name:{
        type:String,
        required:true
    },
    instrumentKey:{
        type:String,
        required:true
    },
    price:{type: Number},
    percent:{type: String},
    isDown:{type: Boolean},
    addedAt:{
        type:Date,
        default:Date.now
    },
},
],
} , {timestamps: true});

module.exports = WatchlistSchema;