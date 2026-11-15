const mongoose = require('mongoose');

const PositionsSchema = new mongoose.Schema({
    instrumentKey: {
        type: String,
        required: true,
        },
    product: String,
    name: String,
    qty: Number,
    avg: Number,
    price: Number,
    net: String,
    day: String,
    isLoss: Boolean,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,

    }
})

PositionsSchema.index(
    { userId: 1, instrumentKey: 1 },
    { unique: true }
);


module.exports = PositionsSchema;