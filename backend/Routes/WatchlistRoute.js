const router = require("express").Router();

const {userVerification} = require("../Middlewares/AuthMiddleware");

const {getWatchlist , addToWatchlist , removeFromWatchlist} = require("../Controllers/WatchlistController");

router.get("/watchlist" , userVerification , getWatchlist);
router.post("/watchlist/add" , userVerification , addToWatchlist);
router.delete("/watchlist/remove/:instrumentKey" , userVerification , removeFromWatchlist);

module.exports = router;
