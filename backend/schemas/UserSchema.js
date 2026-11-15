const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Your email address is required"],
        unique: true,
        lowercase:true,
        trim:true,

    },
    username: {
        type: String,
        required: [true, "Your username is required"],
        trim:true,
    },
    password: {
        type: String,
        required: [true, "Your password is required"],
    },
},
{
    timestamps: true,
}

);

module.exports = UserSchema;