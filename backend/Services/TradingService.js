const mongoose = require('mongoose');
const WalletsModel = require("../model/WalletsModel");
const HoldingsModel = require("../model/HoldingsModel");
const OrdersModel = require("../model/OrdersModel");
const PositionsModel = require("../model/PositionsModel");


async function buyStock(order, userId) {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { name, qty, price, instrumentKey } = order;

        const totalCost = Number(qty) * Number(price);

        let wallet = await WalletsModel.findOne({
            userId: userId,
        }).session(session);

        if (!wallet) {
            throw new Error(" Wallet not found.");
        }
        if (wallet.balance < totalCost) {
            throw new Error("Insufficient wallet balance");
        }

        wallet.balance -= totalCost;
        await wallet.save({ session });

        let holding = await HoldingsModel.findOne({
            instrumentKey: instrumentKey,
            userId: userId,
        }).session(session);

        if (holding) {
            holding.qty += Number(qty);

            holding.avg = (
                holding.avg * (holding.qty - Number(qty)) + Number(price) * Number(qty)
            ) / holding.qty;
            holding.price = Number(price);
            await holding.save({ session });
        } else {
            const newHolding = new HoldingsModel({
                name: name,
                instrumentKey: instrumentKey,
                qty: Number(qty),
                avg: Number(price),
                price: Number(price),
                net: "0%",
                day: "0%",
                userId: userId,
            });

            await newHolding.save({ session });
        }

        let position = await PositionsModel.findOne({
            instrumentKey: instrumentKey,
            userId: userId
        }).session(session);

        if (position) {

            const oldQty = position.qty;

            position.qty += Number(qty);

            position.avg =
                (
                    position.avg * oldQty +
                    Number(price) * Number(qty)
                ) / position.qty;

            position.price = Number(price);

            await position.save({ session });

        } else {

            const newPosition = new PositionsModel({
                instrumentKey: instrumentKey,
                product: "CNC",
                name: name,
                qty: Number(qty),
                avg: Number(price),
                price: Number(price),
                net: "0%",
                day: "0%",
                isLoss: false,
                userId: userId
            });

            await newPosition.save({ session });
        }
        const newOrder = new OrdersModel({
            ...order,
            userId: userId,
        });

        await newOrder.save({ session });



        await session.commitTransaction();
    }

    catch (err) {
        await session.abortTransaction();
        throw err;
    }
    finally {
        session.endSession();
    }
}

async function sellStock(order, userId) {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { name, qty, price, instrumentKey } = order;


        const holding = await HoldingsModel.findOne(
            {
                instrumentKey: instrumentKey,
                userId: userId,
            }).session(session);

        if (!holding) {
            throw new Error("You don't own this stock.");
        };


        if (holding.qty < Number(qty)) {
            throw new Error("Not Enough Shares to sell.")
        }
        holding.qty -= Number(qty);

        if (holding.qty == 0) {
            await HoldingsModel.deleteOne({
                instrumentKey: instrumentKey,
                userId: userId,
            },
                {
                    session
                }
            )
        } else {
            await holding.save({ session });
        }


        let position = await PositionsModel.findOne({
            instrumentKey: instrumentKey,
            userId: userId
        }).session(session);

        if (!position) {
            throw new Error("Position not found.");
        }

        if (position.qty < Number(qty)) {
            throw new Error("Not enough quantity in position.");
        }

        position.qty -= Number(qty);

        if (position.qty === 0) {

            await PositionsModel.deleteOne({
                instrumentKey: instrumentKey,
                userId: userId
            }).session(session);

        } else {

            await position.save({ session });

        }

        const wallet = await WalletsModel.findOne({
            userId: userId
        }).session(session);

        if (!wallet) {
            throw new Error("Wallet not found");
        }
        let totalCost = Number(qty) * Number(price);
        wallet.balance += totalCost;
        await wallet.save({ session });

        const newOrder = new OrdersModel({
            ...order,
            userId: userId,
        });
        await (newOrder.save({ session }));

        await session.commitTransaction();
    }
    catch (err) {
        await session.abortTransaction();
        throw err;
    }
    finally {
        session.endSession();
    }
}



module.exports = {
    buyStock,
    sellStock
};