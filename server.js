const express = require("express");
const { main } = require("./app");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require("express-session");
const User = require("./model/user");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const localStrategy = require('passport-local');
const SearchHistory = require('./model/Searchhistory');

passport.use(new localStrategy(User.authenticate()));

const server = express();
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));
server.use(express.static('public'));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(session({
    resave: false,
    saveUninitialized:false,
    secret: "hjjjdjjdjdjjd",
    
}))
server.use(flash());
server.use(passport.initialize());
server.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
server.get('/' , function(req , res){
    res.render('auth');
})
server.get('/index', isLoggedIn ,async function (req, res) {
    req.flash('success' , 'successfully logged in!!');
    const successFlash = req.flash('success');
    console.log(successFlash);
    const userData = await User.findOne(
        { 
            username: req.user.username
        }
    );
    const userId = req.user._id; // Assuming user ID is available in the request
    const searchHistory = await SearchHistory.find({ user: userId }).sort({ timestamp: -1 }).limit(10); // Limit to 10 most recent searches
    // Pass search history to the view for rendering
    // res.render('index', { searchHistory });
    console.log(userData);
    res.render('index' , {successFlash , userData , searchHistory});

})

server.get('/verify' , (req, res) => {
    const successFlash = req.flash('success');
    const errorFlash = req.flash('error');
    res.render('verify' , {successFlash , errorFlash});
})

server.post('/register', async function(req, res) {
    let userData = new User({
        username:req.body.username,
        password:req.body.password
    });
    await User.register(userData, req.body.password)
    .then((registeredUser)=>{
        passport.authenticate('local')(req , res , ()=>{
            res.redirect('/index');
        });
    })
});
server.post('/login', passport.authenticate('local' ,{
    successRedirect:"/index",
    failureRedirect: "/verify",
    failureFlash:true,
    successFlash:true
}) ,(req , res) =>{
    console.log({success: true});
});

server.get("/logout" , (req , res , next)=>{
    req.logout((err)=>{
        if(err) return next(err);
        return res.redirect("/verify");
    });
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/verify");
}

server.get('/api' ,async function(req, res){
    try {
        const userPrompt = req.query.prompt;
        const userId = req.user._id;
        const apiData = await main(userPrompt);
        res.json({ response: apiData }); //JSON
        const searchHistory = new SearchHistory({
            user: userId,
            query: userPrompt
        });
        await searchHistory.save();
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

server.listen(8080 , ()=>{
    console.log('listening on port 8080');
});
