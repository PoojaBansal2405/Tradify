const { userVerification } = require("../Middlewares/AuthMiddleware");
const {getAllStocks , getAllOrders, getAllHoldings , getAllPositions , searchStocks} = require("../Controllers/PortfolioController");
const router = require("express").Router();


router.get('/allHoldings', userVerification,getAllHoldings );

router.get('/allPositions', userVerification,getAllPositions )

router.get("/allOrders", userVerification,getAllOrders )

router.get("/allStocks", getAllStocks)

router.get("/searchStocks" , searchStocks);

module.exports = router;