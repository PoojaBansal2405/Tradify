const UsersModel = require("../model/UsersModel")
const WalletsModel = require("../model/WalletsModel")
const {createSecretToken} = require("../util/SecretToken")
const bcrypt = require("bcryptjs");

const isProduction = process.env.NODE_ENV === "production";

module.exports.Signup = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await UsersModel.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const user = await UsersModel.create({
            email: normalizedEmail,
            password,
            username
        });

        console.log("User created:", user._id);

        const wallet = await WalletsModel.create({
            userId: user._id,
            balance: 10000,
        });

        console.log("Wallet created:", wallet._id);

        const token = createSecretToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
        });

        return res.status(201).json({
            success: true,
            message: "Signup successful",
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });

    } catch (error) {

        console.error("SIGNUP ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if all fields are provided
        if (!email || !password ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Find user
        const normalizedEmail = email.trim().toLowerCase();
        const user = await UsersModel.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Compare password
        const auth = await bcrypt.compare(password, user.password);

        if (!auth) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate JWT
        const token = createSecretToken(user._id);

        // Store token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


module.exports.Logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
    });

    return res.json({
        success: true,
        message: "Logged out successfully"
    });
};


