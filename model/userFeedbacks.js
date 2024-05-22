const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/login-app-db');
// const plm = require('passport-local-mongoose');
const userFeedback = new mongoose.Schema({
    name:{
        type:String,
    },
    message:{
        type:String
    }
})
// userFeedback.plugin(plm);
const userFeedbacks = mongoose.model('userFeedbacks' , userFeedback);
module.exports = userFeedbacks;


