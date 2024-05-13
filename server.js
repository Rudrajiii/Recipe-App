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
const cookieParser = require('cookie-parser')
const localStrategy = require('passport-local');

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
server.get('/index', isLoggedIn , function (req, res) {
    req.flash('success' , 'successfully logged in!!');
    const successFlash = req.flash('success');
    // console.log(successFlash);
    res.render('index' , {successFlash , username: req.user.username });
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
            res.redirect('/verify');
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
        const apiData = await main(userPrompt);
        res.json({ response: apiData }); //JSON
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

server.listen(8080 , ()=>{
    console.log('listening on port 8080');
});
