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
const { storage, ref, uploadBytes, getDownloadURL , deleteObject } = require('./firebase');
const { v4: uuidv4 } = require('uuid');
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
// Serve static files from the 'public' directory
server.use(express.static(path.join(__dirname, 'public')));
// server.use(express.static("public"));
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

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/images/uploads/'));
  },
  filename: function (req, file, cb) {
    const sanitizedFilename = file.fieldname + Date.now() + 
      path.extname(file.originalname).replace(/\s+/g, '_'); // Replace spaces with underscores
    cb(null, sanitizedFilename);
  },
});

// const upload = multer({ storage: multerStorage });
// Update the multer configuration to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

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
    // Replace only on Windows (backslashes) or use a relative path directly
    modifiedImagePath = userData.profilePic.replace(/\\/g, '/').replace('public/', '');
  } else {
    modifiedImagePath = "/images/uploads/default.jpg";
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
    if (req.file) {
      const fileBuffer = req.file.buffer;
      const filename = `${uuidv4()}_${req.file.originalname}`;
      const storageRef = ref(storage, `images/${filename}`);
      await uploadBytes(storageRef, fileBuffer);
      profilePicPath = await getDownloadURL(storageRef);
    } else {
      profilePicPath = "/images/uploads/default.jpg";
    }
    // if (!req.file) {
    //   // Set default image path if no image is uploaded
    //   profilePicPath = "../images/uploads/default.jpg";
    // } else {
    //   // profilePicPath = '/images/uploads/' + req.file.filename;
    //   const storageRef = ref(storage, `images/${uuidv4()}_${req.file.originalname}`);
    //   await uploadBytes(storageRef, req.file.buffer);
    //   profilePicPath = await getDownloadURL(storageRef); // Get the Firebase URL
    // }
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

//*render User Profile
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


//*update User Profile

server.post("/profile/update", isLoggedIn, upload.single("profilePic"), async function(req, res) {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    user.email = req.body.email || user.email;
    user.username = req.body.username || user.username;

    if (req.file) {
      // Delete old profile picture if it's not the default
      if (user.profilePic && !user.profilePic.includes("default.jpg")) {
        const oldFileName = user.profilePic.split('/').pop().split('?')[0];
        const oldImageRef = ref(storage, `images/${oldFileName}`);
        
        try {
          await deleteObject(oldImageRef);
          console.log("Old profile picture deleted successfully.");
        } catch (error) {
          console.error("Error deleting old profile picture:", error);
        }
      
      }
      
      // Upload the new profile picture
      const fileBuffer = req.file.buffer;
      const filename = `${uuidv4()}_${req.file.originalname}`;
      const storageRef = ref(storage, `images/${filename}`);
      await uploadBytes(storageRef, fileBuffer);
      const newProfilePicUrl = await getDownloadURL(storageRef);
      
      user.profilePic = newProfilePicUrl;
    }

    if (req.body.password) {
      await user.setPassword(req.body.password);
    }

    await user.save();
    req.flash("success", "Profile successfully updated!");
    res.redirect("/index");
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).send("Internal Server Error");
  }
});

server.get("/viewProfile", isLoggedIn, async function(req, res) {
  const userId = req.user._id;
  const user = await User.findById(userId);
  let profile;

  if (!user.profilePic || user.profilePic.includes("default.jpg")) {
    profile = "/images/uploads/default.jpg";
  } else {
    profile = user.profilePic;
  }

  res.render("viewProfile", {
    user,
    profile
  });
});


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


// Debugging route to list uploaded files
server.get('/debug-uploads', (req, res) => {
  const uploadsDir = path.join(__dirname, 'public/images/uploads');
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return res.status(500).send('Error reading uploads directory');
    res.json(files);
  });
});

//server listening on port 8080
server.listen(PORT, () => {
  console.log("listening on port 8080");
});


