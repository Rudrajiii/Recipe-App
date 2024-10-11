const express = require("express");
const { main } = require("./app");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const localStrategy = require("passport-local");
const SearchHistory = require("./model/Searchhistory");
const multer = require("multer");
const nodemailer = require("nodemailer");
const {EMAIL , PASSWORD} = require("./env.js");
const Mailgen = require("mailgen");
const fs = require("fs");
const userFeedbacks = require("./model/userFeedbacks.js");
const PORT = process.env.PORT || 3000;
passport.use(new localStrategy(User.authenticate()));

function extractDate(timestampString) {
  timestampString = String(timestampString);
  const regex = /\b(\w{3}\s\w{3}\s\d{1,2}\s\d{4})\b/;
  
  const match = timestampString.match(regex);
  
  return match ? match[1] : null;
}

const server = express();
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));
server.use(express.static("public"));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "hjjjdjjdjdjjd",
  })
);
server.use(flash());
server.use(passport.initialize());
server.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads/"); // Save uploaded files to uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname)); // Rename file with current timestamp
  },
});

const upload = multer({ storage: storage });

server.get("/", function (req, res) {
  const itemNotFoundError = req.flash("error");
  res.render("auth", { itemNotFoundError: itemNotFoundError });
});
server.get("/index", isLoggedIn, async function (req, res) {
  req.flash("success", "successfully logged in!!");
  const successFlash = req.flash("success");
  // const errorFlash = req.flash("error");
  console.log(successFlash);
  const userData = await User.findOne({
    username: req.user.username,
  });
  const userId = req.user._id; // Assuming user ID is available in the request
  const searchHistory = await SearchHistory.find({ user: userId })
    .sort({ timestamp: -1 })
    .limit(10); // Limit to 10 most recent searches
  // Pass search history to the view for rendering
  // res.render('index', { searchHistory });
  console.log(userData);
  let modifiedImagePath;
  if (userData.profilePic) {
    modifiedImagePath = userData.profilePic.replace("public\\", "../");
  } else {
    // If no profile picture is uploaded, use a default image path
    modifiedImagePath = "../images/uploads/default.jpg";
  }
  // const modifiedImagePath = userData.profilePic.replace('public\\', '../');

  res.locals.extractDate = extractDate;

  res.render("index", {
    successFlash,
    userData,
    searchHistory,
    modifiedImagePath,
  });
});

server.get("/verify", (req, res) => {
  const successFlash = req.flash("success");
  const errorFlash = req.flash("error");
  res.render("verify", { successFlash, errorFlash });
});

server.post(
  "/register",
  upload.single("profilePic"),
  async function (req, res) {
    // if (!req.file) {
    //   const picNotUploadError = req.flash("error", "Please upload a profile picture");
    //   return res.redirect("/" );
    // }
    let profilePicPath;
    if (!req.body.email) {
      req.flash("error", "Please provide an email address");
      return res.redirect("/");
    }
    if (!req.file) {
      // Set default image path if no image is uploaded
      profilePicPath = "../images/uploads/default.jpg";
    } else {
      profilePicPath = req.file.path;
    }
    if (!req.body.username) {
      const userNameNotFoundError = req.flash("error", "Please provide a username");
      return res.redirect("/");
    }
    if (!req.body.password) {
      const passwordNotFoundError = req.flash("error", "Please provide a password");
      return res.redirect("/");
    }

    const userEmail = req.body.email;
    const userName = req.body.username;
    // Check if user already exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      req.flash("error", "Username already in use");
      return res.redirect("/");
    }
    let userData = new User({
      username: req.body.username,
      email: userEmail,
      profilePic: profilePicPath || "../images/uploads/default.jpg",
      password: req.body.password,
    });
    await User.register(userData, req.body.password).then((registeredUser) => {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/index");
        sendRegistrationEmail(userEmail , userName);
      });
    });
  }
);
server.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/verify",
    failureFlash: true,
    successFlash: true,
  }),
  (req, res) => {
    console.log({ success: true });
  }
);

server.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.redirect("/verify");
  });
});

//!Work as protection route
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/verify");
}

server.get("/api", async function (req, res) {
  try {
    const userPrompt = req.query.prompt;
    // if (!userPrompt || userPrompt.trim() === "") {
    //   req.flash("error", "Input prompt cannot be empty");
    //   return res.redirect("/index"); // Adjust the redirect path to your form page
    // }
    const userId = req.user._id;
    const apiData = await main(userPrompt);
    res.json({ response: apiData }); //JSON
    const searchHistory = new SearchHistory({
      user: userId,
      query: userPrompt,
    });
    await searchHistory.save();
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal Server Error");
    res.redirect("/index");
  }
});

//todo: demo Sending emails as a successfull registration in our app to real users

function sendRegistrationEmail(userEmail , userName) {
  let config = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    service: 'gmail',
    auth: {
      user: EMAIL,
      pass: PASSWORD
    }
  }

  const transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: 'https://mailgen.js/'
    }
  });

  let response = {
    body: {
      name: "From Recipie.in",
      intro: `Hey ${userName},\n\nWelcome to Recipie.in! Here, you can discover a world of delicious recipes with just a single prompt.`,
      table: {
        data: [
          {
            reciver: userName,
            description: "Your personal recipe assistant",
            status: "Registration Successful.",
          }
        ]
      },
      outro: "We're excited to have you on board. Happy cooking!😊❤️‍🔥"
    }
  }

  let mail = MailGenerator.generate(response);

  let message = {
    from: EMAIL,
    to: userEmail, // Use captured email address
    subject: "Welcome to Recipie.in - Registration Successful ",
    html: mail
  }

  transporter.sendMail(message)
    .then(() => {
      console.log("Registration email sent successfully to", userEmail);
    })
    .catch(error => {
      console.error("Error sending registration email:", error);
    });
}

//*Update User Profile
server.get("/profile/:userId", isLoggedIn, async function(req, res) {
  if (req.user) {
    const userId = req.user._id;

    try {
      const userData = await User.findById(userId);
      
      res.render("profile", { userData });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    // Handle case when user is not logged in
    res.redirect("/verify");
  }
});



server.post("/profile/update", isLoggedIn, upload.single("profilePic"), async function(req, res) {
  const userId = req.user._id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // Delete old profile picture if a new one is uploaded
    if (req.file && user.profilePic && user.profilePic !== "../images/uploads/default.jpg") {
      fs.unlink(user.profilePic, (err) => {
        if (err) {
          console.error("Error deleting old profile picture:", err);
        } else {
          console.log("Old profile picture deleted successfully.");
        }
      });
    }

    // Update email if provided
    user.email = req.body.email || user.email;
    user.username = req.body.username || user.username;
    user.password = req.body.password || user.password;

    // Update profile picture if a new one is uploaded
    if (req.file) {
      user.profilePic = req.file.path;
    }

    // Update password if a new one is provided
    if (req.body.password) {
      await user.setPassword(req.body.password); // Use setPassword to properly hash and salt the new password
    }

    // Save the updated user object
    await user.save();

    // Set a success flash message
    req.flash("success", "Profile successfully updated!");

    // Redirect to the index page with the success flash message
    res.redirect("/index");
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).send("Internal Server Error");
  }
});

server.get("/viewProfile" , isLoggedIn ,async function(req , res){
  const userId = req.user._id;
  const user = await User.findById(userId);
  let profile;

  if(!user.profilePic){
    profile = "../images/uploads/default.jpg";

  }else{
    profile = user.profilePic.replace("public\\", "../");
  } 

  console.log(user);
  res.render("viewProfile" ,{
    user,
    profile
  });
})

server.post('/submit-feedback', async (req, res) => {
  const { name, message } = req.body;

  const feedback = new userFeedbacks({
      name: name || 'Anonymous', // Default to 'Anonymous' if name is not provided
      message
  });

  try {
      await feedback.save();
      res.status(200).send('Feedback submitted successfully!');
  } catch (error) {
      console.error('Error saving feedback:', error);
      res.status(500).send('Error submitting feedback.');
  }
});


//server listening on port 8080
server.listen(PORT, () => {
  console.log("listening on port 8080");
});


