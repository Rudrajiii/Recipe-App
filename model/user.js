const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/login-app-db');
const plm = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    email: String,
    profilePic: String 
} ,
{
    collection : 'users'
})
userSchema.plugin(plm);
const model = mongoose.model('userSchema' , userSchema);
module.exports = model;

