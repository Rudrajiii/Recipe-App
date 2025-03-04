const mongoose = require('mongoose');
const { use } = require('passport');
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gbwac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
const generatedRecipeDetails = new mongoose.Schema({
    user_query:{
        type:String,
        required:true
    },
    recipe_details: {
        type: String
    },
    analysis:{
        type:String
    },
    user_id:{
        type:String,
        required:true
    },
    user_profile_pic:{
        type:String,
        required:true
    },
    user_name:{
        type:String,
        required:true
    }
})
const generatedRecipes = mongoose.model('generatedRecipes' , generatedRecipeDetails);
module.exports = generatedRecipes;


