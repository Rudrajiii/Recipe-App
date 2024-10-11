const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gbwac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
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

