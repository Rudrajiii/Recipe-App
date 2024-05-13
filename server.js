const express = require("express");
const { main } = require("./app");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require("express-session");
const User = require("./model/user");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const localStrategy = require('passport-local');

passport.use(new localStrategy(User.authenticate()));

const server = express();
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));
server.use(express.static('public'));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(session({
    resave: false,
    saveUninitialized:false,
    secret: "hjjjdjjdjdjjd"

}))
server.use(passport.initialize());
server.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
server.get('/' , function(req , res){
    res.render('auth');
})
server.get('/index', isLoggedIn , function (req, res) {
    res.render('index');
})

server.get('/verify' , (req, res) => {
    res.render('verify');
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
    failureRedirect: "/"
}) ,(req , res) =>{

});



server.get("/logout" , (req , res , next)=>{
    req.logout((err)=>{
        if(err) return next(err);
        return res.redirect("/");
    });
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
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
