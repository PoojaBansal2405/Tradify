const { userVerification } = require("../Middlewares/AuthMiddleware");
const {getFunds ,addFunds,withdrawFunds}=require("../Controllers/WalletController.js");
const router = require("express").Router();

router.get("/funds", userVerification, getFunds);
router.post("/addFunds", userVerification ,addFunds);
router.post("/withdrawFunds", userVerification,withdrawFunds);

module.exports = router;