const mongoose = require("mongoose");

const WalletsSchema = require("../schemas/WalletsSchema");

const WalletsModel =  mongoose.model("wallet" , WalletsSchema);

module.exports = WalletsModel;