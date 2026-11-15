
const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, "../.env"),
});

const UpstoxClient = require("upstox-js-sdk");
const { WebSocketServer, WebSocket } = require("ws");

const defaultClient = UpstoxClient.ApiClient.instance;
const OAUTH2 = defaultClient.authentications["OAUTH2"];

OAUTH2.accessToken = process.env.UPSTOX_ANALYTICS_TOKEN;

if (!OAUTH2.accessToken) {
    throw new Error("UPSTOX_ANALYTICS_TOKEN is missing from .env");
}

const livePrices = {};

const initialInstruments = [
    "NSE_EQ|INE009A01021",
    "NSE_EQ|INE467B01029",
    "NSE_EQ|INE002A01018",
    "NSE_EQ|INE075A01022",
    "NSE_EQ|INE848E01016",
];

const websocketPort = Number(process.env.WS_PORT || 8081);

if (
    !Number.isInteger(websocketPort) ||
    websocketPort < 1 ||
    websocketPort > 65535
) {
    throw new Error("WS_PORT must be an integer between 1 and 65535");
}

const streamer = new UpstoxClient.MarketDataStreamerV3(
    initialInstruments,
    "full"
);
const wss = new WebSocketServer({ port: websocketPort });
const pendingSubscriptions = new Set();
let isStreamerConnected = false;

function subscribeToStock(instrumentKey) {
    if (typeof instrumentKey !== "string" || !instrumentKey.trim()) {
        return;
    }

    if (!isStreamerConnected) {
        pendingSubscriptions.add(instrumentKey);
        return;
    }

    streamer.subscribe([instrumentKey], "full");
}

streamer.on("open", () => {
    isStreamerConnected = true;
    console.log("Connected to Upstox Market Data WebSocket");

    if (pendingSubscriptions.size > 0) {
        try {
            streamer.subscribe([...pendingSubscriptions], "full");
            pendingSubscriptions.clear();
        } catch (error) {
            console.error(
                "Failed to subscribe to queued instruments:",
                error.message
            );
        }
    }
});

streamer.on("message", (data) => {
    if (!data) return;

    try {
        const feed = JSON.parse(data.toString("utf-8"));

        if (!feed.feeds) return;

        const updates = {};

        for (const [key, stockData] of Object.entries(feed.feeds)) {
            const ltpc = stockData.fullFeed?.marketFF?.ltpc;

            const closingPrice = ltpc?.cp;
            const price = ltpc?.ltp;

            if (
                typeof price !== "number" ||
                typeof closingPrice !== "number" ||
                closingPrice === 0
            ) {
                continue;
            }

            const isDown = price < closingPrice;
            const percent = (
                ((price - closingPrice) / closingPrice) * 100
            ).toFixed(2);

            const stockUpdate = {
                price,
                closingPrice,
                isDown,
                percent,
            };

            livePrices[key] = stockUpdate;
            updates[key] = stockUpdate;
        }

        if (Object.keys(updates).length === 0) return;

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(updates), (error) => {
                    if (error) {
                        console.error("Browser WebSocket send error:", error.message);
                    }
                });
            }
        });
    } catch (error) {
        console.error("Failed to process Upstox message:", error.message);
    }
});

streamer.on("error", (error) => {
    console.error("Upstox WebSocket error:", error);
});

streamer.on("close", () => {
    isStreamerConnected = false;
    console.log("Upstox WebSocket closed");
});

wss.on("connection", (ws) => {
    console.log("Frontend connected to WebSocket");

    ws.send(JSON.stringify(livePrices));

    ws.on("error", (error) => {
        console.error("Frontend WebSocket error:", error.message);
    });
});

wss.on("error", (error) => {
    console.error("WebSocket server error:", error.message);
});

wss.on("listening", () => {
    console.log(`Browser WebSocket server listening on port ${websocketPort}`);
});

streamer.connect().catch((error) => {
    console.error("Failed to connect to Upstox Market Data WebSocket:", error.message);
});


module.exports = { subscribeToStock, livePrices };
