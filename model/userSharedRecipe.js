const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gbwac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
const userSharedRecipe = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    imageUrl: {
        type: String, // URL to the uploaded image.
        required:true 
    },
    details:{
        type:String,
        required:true
    }
})
const userFeedbacks = mongoose.model('userSharedRecipe' , userSharedRecipe);
module.exports = userSharedRecipe;


