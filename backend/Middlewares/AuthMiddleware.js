const UsersModel = require("../model/UsersModel");
const jwt = require("jsonwebtoken");

module.exports.userVerification = async (req, res, next) => {
    let token = req.cookies ? req.cookies.token : null;

    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        if (parts.length === 2 && parts[0] === "Bearer") {
            token = parts[1];
        } else {
            token = req.headers.authorization;
        }
    }

    if (!token && req.query && req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        return res.status(401).json({ status: false, message: "No Token provided" });
    }

    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
            return res.status(401).json({ status: false , message:"Invalid or expired token"});
        }

        const user = await UsersModel.findById(data.id);

        if (!user) {
            return res.status(401).json({ status: false ,message: "User not found"});
        }

        req.user = user;

        // If this is /verify, send response
        if (req.path === "/verify") {
            return res.json({
                status: true,
                user: user.username
            });
        }

        // For other protected routes
        next();
    });
};