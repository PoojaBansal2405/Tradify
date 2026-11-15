const mongoose = require('mongoose')

const UserSchema = require('../schemas/UserSchema')
const bcrypt = require("bcryptjs");

UserSchema.pre("save", async function(){
    if(!this.isModified("password"))return;
    this.password = await bcrypt.hash(this.password,12);
    
})
const UsersModel =  mongoose.model("user" , UserSchema);

module.exports = UsersModel;