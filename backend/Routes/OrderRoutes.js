const { userVerification } = require("../Middlewares/AuthMiddleware");
const {OrderController} = require("../Controllers/OrderController");
const router = require("express").Router();

router.post("/newOrder", userVerification, OrderController);

module.exports = router;

