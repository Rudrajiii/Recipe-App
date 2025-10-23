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
const MongoStore = require('connect-mongo');
const axios = require('axios');
const cors = require('cors');
const generatedRecipes = require("./model/generatedRecipeDetails.js");
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

const PORT = process.env.PORT || 3000;
passport.use(new localStrategy(User.authenticate()));

function extractDate(timestampString) {
  timestampString = String(timestampString);
  const regex = /\b(\w{3}\s\w{3}\s\d{1,2}\s\d{4})\b/;
  
  const match = timestampString.match(regex);
  
  return match ? match[1] : null;
}
require('dotenv').config();

// const BASE_URL = "https://food-api-production-5a82.up.railway.app";
let BASE_URL = undefined;
if(process.env.PRODUCTION === "true"){
  console.log("-- Production mode activated");
  BASE_URL = "https://food-api-pi0o.onrender.com";
}else{
  console.log("-- Development mode activated");
  BASE_URL = "http://127.0.0.1:5000";
}

const server = express();

server.use(cors({
  origin: 'http://localhost:8081',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

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
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gbwac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, // Use your MongoDB connection string
      ttl: 14 * 24 * 60 * 60 // Session TTL (14 days)
  }),
  cookie: {
      // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days in milliseconds
  }
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


function extractNutritionStats(analysisString) {
  try {
    const jsonMatch = analysisString.match(/```json\s*({[\s\S]*?})\s*```/);
    if (!jsonMatch) {
      console.error("No JSON found in analysis string.");
      return getDefaultNutritionData();
    }

    const analysisJson = JSON.parse(jsonMatch[1]);

    // Helper function to parse micronutrients
    function formatMicronutrients(data) {
      if (!data || typeof data !== "object") {
        console.error("Micronutrient data is missing or invalid.");
        return { vitamins: [], minerals: [] };
      }

      const formattedVitamins = data.vitamins && typeof data.vitamins === "string"
        ? data.vitamins.split(", ").map(item => {
            if (!item.includes(":")) return [item.trim(), "N/A"];
            const [name, value] = item.split(":");
            return [name.trim(), value.trim()];
          })
        : [];

      const formattedMinerals = data.minerals && typeof data.minerals === "string"
        ? data.minerals.split(", ").map(item => {
            if (!item.includes(":")) return [item.trim(), "N/A"];
            const [name, value] = item.split(":");
            return [name.trim(), value.trim()];
          })
        : [];

      return { vitamins: formattedVitamins, minerals: formattedMinerals };
    }

    // Extract calories
    let caloriesAmount = "N/A";
    let caloriesUnit = "";
    if (analysisJson.calories) {
      const match = String(analysisJson.calories).match(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?/);
      if (match) {
        caloriesAmount = match[1];
        caloriesUnit = match[2] || "";
      } else {
        caloriesAmount = analysisJson.calories;
      }
    }

    // Extract macronutrients
    const macronutrients = {
      protein: {
        amount: analysisJson.macronutrients?.protein?.amount || "N/A",
        unit: analysisJson.macronutrients?.protein?.unit || "",
        dv: analysisJson.macronutrients?.protein?.percent_dv || "N/A",
      },
      fat: {
        amount: analysisJson.macronutrients?.fat?.amount || "N/A",
        unit: analysisJson.macronutrients?.fat?.unit || "",
        dv: analysisJson.macronutrients?.fat?.percent_dv || "N/A",
      },
      carbohydrates: {
        amount: analysisJson.macronutrients?.carbohydrates?.amount || "N/A",
        unit: analysisJson.macronutrients?.carbohydrates?.unit || "",
        dv: analysisJson.macronutrients?.carbohydrates?.percent_dv || "N/A",
      },
      sugar: {
        amount: analysisJson.macronutrients?.sugar?.amount || "N/A",
        unit: analysisJson.macronutrients?.sugar?.unit || "",
        dv: analysisJson.macronutrients?.sugar?.percent_dv || "N/A",
      },
    };

    // Extract micronutrients
    const { vitamins, minerals } = formatMicronutrients(analysisJson.micronutrients);

    // Extract dietary components
    const dietaryComponents = {
      fiber: {
        amount: analysisJson.dietary_fiber?.amount || "N/A",
        unit: analysisJson.dietary_fiber?.unit || "",
        dv: analysisJson.dietary_fiber?.percent_dv || "N/A",
      },
      cholesterol: {
        amount: analysisJson.cholesterol?.amount || "N/A",
        unit: analysisJson.cholesterol?.unit || "",
        dv: analysisJson.cholesterol?.percent_dv || "N/A",
      },
      sodium: {
        amount: analysisJson.sodium?.amount || "N/A",
        unit: analysisJson.sodium?.unit || "",
        dv: analysisJson.sodium?.percent_dv || "N/A",
      },
    };

    // Extract other components
    const otherComponents = {
      transFats: analysisJson.other_components?.trans_fats || "N/A",
      saturatedFats: analysisJson.other_components?.saturated_fats || "N/A",
      additionalInfo: analysisJson.other_components?.additional_info || "N/A",
    };

    // Extract health effects
    const healthEffects = analysisJson.health_effects || "N/A";

    // Return the complete nutrition data
    return {
      calories: { amount: caloriesAmount, unit: caloriesUnit },
      macronutrients,
      micronutrients: { vitamins, minerals },
      dietaryComponents,
      otherComponents,
      healthEffects,
    };
  } catch (error) {
    console.error("Error parsing analysis JSON:", error);
    return getDefaultNutritionData();
  }
}

// Default nutrition data structure
function getDefaultNutritionData() {
  return {
    calories: { amount: "N/A", unit: "" },
    macronutrients: {
      protein: { amount: "N/A", unit: "", dv: "N/A" },
      fat: { amount: "N/A", unit: "", dv: "N/A" },
      carbohydrates: { amount: "N/A", unit: "", dv: "N/A" },
      sugar: { amount: "N/A", unit: "", dv: "N/A" },
    },
    micronutrients: { vitamins: [], minerals: [] },
    dietaryComponents: {
      fiber: { amount: "N/A", unit: "", dv: "N/A" },
      cholesterol: { amount: "N/A", unit: "", dv: "N/A" },
      sodium: { amount: "N/A", unit: "", dv: "N/A" },
    },
    otherComponents: { transFats: "N/A", saturatedFats: "N/A", additionalInfo: "N/A" },
    healthEffects: "N/A",
  };
}

// Also update the server route to ensure we always have a valid nutrition object
server.get("/share/:userId/:recipeId", async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    console.log(recipeId);
    const recipeData = await generatedRecipes.findById(recipeId);

    if (!recipeData) {
      return res.status(404).send("Recipe not found!");
    }

    const nutritionStats = extractNutritionStats(recipeData.analysis || "");
    console.log(nutritionStats);
    console.log(recipeData);

    const recipe = {
      imageUrl: recipeData.user_profile_pic || "https://firebasestorage.googleapis.com/v0/b/recipe-app-792c5.appspot.com/o/images%2Fa4440420-bdd2-463c-8965-adfbf3eec1f7_Screenshot%202024-10-03%20005034.png?alt=media&token=d8c4e987-26a2-428e-8e31-4d3ac8591617",
      title: recipeData.user_query || "Recipe",
      description: recipeData.recipe_details || "No description available",
      nutrition: nutritionStats,
      user_name: recipeData.user_name || "Anonymous",
    };

    res.render("recipe_share", { recipe });
  } catch (error) {
    // console.error("Error fetching recipe:", error);
    res.status(500).send("Internal Server Error");
  }
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
  console.log("Users Data: ",userData);
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
    try{
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
  
      await User.register(userData, req.body.password);
  
       // Log the user in after registration
       passport.authenticate("local")(req, res, () => {
        // Set a remember me cookie
        if (req.body.rememberMe) {
            req.session.cookie.maxAge = 14 * 24 * 60 * 60 * 1000; // 14 days
        }
        res.redirect("/index");
    });
  }catch (error) {
    console.error('Registration error:', error);
    req.flash("error", "Registration failed. Please try again.");
    res.redirect("/");
  }
    }
    //imp//
    // await User.register(userData, req.body.password).then((registeredUser) => {
    //   // passport.authenticate("local")(req, res, () => {
    //   //   res.redirect("/index");
    //   //   // sendRegistrationEmail(userEmail , userName);
    //   // });
    // });
);

// server.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/index",
//     failureRedirect: "/verify",
//     failureFlash: true,
//     successFlash: true,
//   }),
//   (req, res) => {
//     console.log({ success: true });
//   }
// );

server.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
      if (err) {
          return next(err);
      }
      if (!user) {
          req.flash("error", "Invalid username or password");
          return res.redirect("/verify");
      }
      req.logIn(user, (err) => {
          if (err) {
              return next(err)
          }
          // Set a remember me cookie if requested
          if (req.body.rememberMe) {
              req.session.cookie.maxAge = 14 * 24 * 60 * 60 * 1000; // 14 days
          }
          return res.redirect("/index");
      });
  })(req, res, next);
});

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
    console.log(userPrompt);

    if (!userPrompt || userPrompt.trim() === "") {
      return res.status(400).json({
        error: "Please enter a query to generate something tasty 🍔🍟",
      });
    }

    const userId = req.user._id;
    // Call the main function to generate the recipe details and analysis
    const { apiData, analysis } = await main(userPrompt);
    // res.json({ response: apiData }); //JSON
    const userData = await User.findById(userId);
    // console.log("logging up user data for checking",userData.profilePic);
    const searchHistory = new SearchHistory({
      user: userId,
      query: userPrompt.toLowerCase().trim(),
    });
    await searchHistory.save();
    // console.log("analysis output =>", analysis);

    // Save the generated recipe details to the database
    const saveRecipeDetails = new generatedRecipes({
      user_query: userPrompt.trim(),
      recipe_details: apiData,
      analysis: analysis,
      user_id: userId,
      user_profile_pic:userData.profilePic,
      user_name:userData.username,
    });
    await saveRecipeDetails.save();

    // Redirect to the /share endpoint with the _id of the newly created recipe
    console.log("Saved Recipe Details:", saveRecipeDetails);
    const recipeLink = `https://recipe-app-u78t.onrender.com/share/${userId}/${String(saveRecipeDetails._id)}`;
    console.log("mongo id => ",String(saveRecipeDetails._id));
    res.json({
      response: apiData,
      recipeId: String(saveRecipeDetails._id),
      recipeLink: recipeLink,
      analysis:analysis,
    });

  } catch (error) {
    console.error("LOGGING ERROR: ",error);
    req.flash("error", "Internal Server Error");
    res.status(500).json({
      error: "Internal Server Error. Please try again later.",
      details: error.message,
    });
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
  const recipe_details = await generatedRecipes.find({ user_id: userId });
  // console.log(recipe_details , recipe_details.length);
  let profile;

  if (!user.profilePic || user.profilePic.includes("default.jpg")) {
    profile = "/images/uploads/default.jpg";
  } else {
    profile = user.profilePic;
  }
  const shortenText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  res.render("viewProfile", {
    user,
    profile,
    userId,
    recipe_details,
    shortenText,
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

server.get('/get-markdown', (req, res) => {
  const filePath = path.join(__dirname, 'nutrition_analysis.md'); // Path to your markdown file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading the markdown file');
    } else {
      res.send(data); // Send markdown content as response
    }
  });
});



server.get("/history", async (req, res) => {
  try {
    // Default user ID or use the one from request parameters
    let _id = req.query.userId;
    // console.log(_id);

    // Fetch all records from the database
    const promptHistory = await SearchHistory.find({});

    // Initialize query count object
    const queryCount = {};

    // Process each record to count queries per user
    for (let record of promptHistory) {
      let user_id = String(record.user);
      // console.log(user_id);
      const query = record.query;

      if (!queryCount[user_id]) {
        queryCount[user_id] = {};
      }

      // Only count non-empty and defined queries
      if (query && query.trim() !== "") {
        queryCount[user_id][query] = (queryCount[user_id][query] || 0) + 1;
      }
    }

    // Extract query count for the specific user
    let userQueryCount = queryCount[_id] || {};

    // Send the JSON response
    res.json(userQueryCount);

    // Write the full query count to a file after sending the response
    fs.writeFileSync('queryCount.json', JSON.stringify(queryCount, null, 4));
    console.log("Query count saved to queryCount.json");
  } catch (error) {
    // Handle errors and send a meaningful response
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
});



server.get("/history", async (req, res) => {
  try {
      let _id = "67096e4f1ddc7749a57ed49b" || req.params.userId;
      const promptHistory = await SearchHistory.find({});
      const queryCount = {};

      for (let record of promptHistory) {
          let user_id = record.user;
          const query = record.query;

          if (!queryCount[user_id]) {
              queryCount[user_id] = {};
          }
          if(query != "" && query != undefined){
            queryCount[user_id][query] = (queryCount[user_id][query] || 0) + 1;
          }
      }

      // res.json(queryCount);
      let i = queryCount[_id];
      res.json(i);
      fs.writeFileSync('queryCount.json', JSON.stringify(queryCount, null, 4));
      console.log("Query count saved to queryCount.json");

  } catch (error) {
      // Send error response only if no previous response was sent
      if (!res.headersSent) {
          res.status(500).send(error);
      } else {
          console.error("Failed to send error response: ", error);
      }
  }
});

server.get('/getTutorial', async (req, res) => {
  try {
    const userInput = req.query.userInput; 
    console.log(userInput);
    const response = await axios.get(`${BASE_URL}/search?query=${userInput}&maxResults=2`);

    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ message: 'No tutorial found.' });
    }

    // const video = response.data.items[0];

    // const tutorialData = {
    //   userInput:userInput,
    //   title: video.snippet.title,
    //   description: video.snippet.description,
    //   videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`, // Generate video URL
    //   thumbnail: video.snippet.thumbnails.high.url
    // };

    // Extract data for both videos
    const tutorials = response.data.items.map(video => ({
      title: video.snippet.title,
      description: video.snippet.description,
      videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      thumbnail: video.snippet.thumbnails.high.url
    }));

    console.log(tutorials);
    // console.log(tutorialData);

    res.json(tutorials); 
  } catch (error) {
    console.error('Error fetching tutorial:', error);
    res.status(500).json({ message: 'Error fetching tutorial.' });
  }
});


server.get('/translate', async (req, res) => {
  try {
      const text = req.query.text;
      const targetLang = req.query.targetLang || 'hi';

      // Call the external translation API
      //https://food-api-pi0o.onrender.com
      const response = await axios.get(`${BASE_URL}/tran`, {
          params: {
              prompt: text,
              targetLang: targetLang
          }
      });

      res.json({
          success: true,
          translatedText: response.data
      });

  } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({
          success: false,
          error: 'Translation failed',
          message: error.message
      });
  }
});

//server listening on port 8080
server.listen(PORT, () => {
  console.log("listening on port 8081 link\nhttp://localhost:8081");
});




