const mongoose = require("mongoose");

const WalletsSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true,
    },
    balance:{
        type:Number,
        required:true,
        min:0,
        default:10000,
    },
},
{
    timestamps:true,
}
)

module.exports = WalletsSchema;