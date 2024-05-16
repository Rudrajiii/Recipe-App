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
      req.flash("error", "This Username already in use , try another one.");
      return res.redirect("/");
    }
    let userData = new User({
      username: req.body.username,
      email: userEmail,
      // profilePic: req.file.path,
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
    res.status(500).send("Internal Server Error");
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
      name: "From Vicky",
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

server.listen(8080, () => {
  console.log("listening on port 8080");
});
