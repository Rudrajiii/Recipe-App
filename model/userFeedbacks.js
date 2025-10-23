const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gbwac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
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


