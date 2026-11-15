const WalletsModel = require("../model/WalletsModel");


// GET /funds
const getFunds = async (req, res) => {
    try {
        const wallet = await WalletsModel.findOne({
            userId: req.user.id
        });

        if (!wallet) {
            return res.status(404).json({
                message: "Wallet not found"
            });
        }

        res.status(200).json(wallet);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


// POST /addFunds
const addFunds = async (req, res) => {
    try {
        const amountNumber = Number(req.body.amount);

        if (amountNumber <= 0 || isNaN(amountNumber)) {
            return res.status(400).json({
                message: "Amount must be greater than 0"
            });
        }

        const wallet = await WalletsModel.findOne({
            userId: req.user.id
        });

        if (!wallet) {
            return res.status(404).json({
                message: "Wallet not found"
            });
        }

        wallet.balance += amountNumber;

        await wallet.save();

        res.status(200).json({
            success: true,
            message: "Funds added successfully",
            balance: wallet.balance
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// POST /withdrawFunds
const withdrawFunds = async (req, res) => {
    try {
        const amountNumber = Number(req.body.amount);

        if (amountNumber <= 0 || isNaN(amountNumber)) {
            return res.status(400).json({
                message: "Amount must be greater than 0"
            });
        }

        const wallet = await WalletsModel.findOne({
            userId: req.user.id
        });

        if (!wallet) {
            return res.status(404).json({
                message: "Wallet not found"
            });
        }

        if (amountNumber > wallet.balance) {
            return res.status(400).json({
                message: "Not enough funds to withdraw"
            });
        }

        wallet.balance -= amountNumber;

        await wallet.save();

        res.status(200).json({
            success: true,
            message: "Funds withdrawal successful",
            balance: wallet.balance
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


module.exports = {
    getFunds,
    addFunds,
    withdrawFunds
};