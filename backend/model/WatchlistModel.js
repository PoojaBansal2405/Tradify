const WatchlistSchema = require("../schemas/WatchlistSchema");
const mongoose = require("mongoose");

const WatchlistModel = mongoose.model("watchlist" , WatchlistSchema);

module.exports = WatchlistModel;