# Recipe-App ~

It's basically a Recipe Generation wep app using the LLM Model mixtral-8x7b-32768
Provided by GROQ API✨It's Very Very Fast
Here it's Stats From official GROQ WEbSite

<div align="center">
  <video src="https://github.com/user-attachments/assets/515f8340-925e-4529-a406-5f63900cd896" width="640" height="360" autoplay controls></video>
</div>

## Performance Metrics

### Round Trip Time
- 1.26s

### Model
- mixtral-8x7b-32768

### Detailed Metrics

| Metric               | Input | Output | Total |
|----------------------|-------|--------|-------|
| Speed (Tokens/s)     | 1235  | 629    | 655   |
| Tokens               | 22    | 251    | 273   |
| Inference Time (s)   | 0.02  | 0.40   | 0.42  |


Tech Stack 👀 

✅Frontend : Ejs , Scss , Bootstrap, Vanilla Js 
✅ Backend : Node & Express Js

# Recipe.in

The core idea behind Recipe.in is to generate delicious recipes with just one simple prompt. It's designed to make cooking fun and easy for everyone, from beginners to seasoned chefs.

## Table of Contents

- [Introduction](#introduction)
- First Look ⚡
- ![Screenshot 2024-02-16 220310](https://github.com/Rudrajiii/Recipe-App/blob/main/public/images/uploads/Screenshot%202024-10-10%20173042.png?raw=true)
- Main Dashboard ⭐
- ![Screenshot 2024-02-16 220310](https://github.com/Rudrajiii/Recipe-App/blob/main/public/images/uploads/WhatsApp%20Image%202024-05-28%20at%2010.09.36_b46febd5.jpg?raw=true)
- Response Generation ✅
- ![Screenshot 2024-02-16 220310](https://github.com/Rudrajiii/Recipe-App/blob/main/public/images/uploads/WhatsApp%20Image%202024-05-28%20at%2010.09.36_796b9fcf.jpg?raw=true)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

Recipe.in is an innovative application designed to generate delicious recipes with just one simple prompt. It's designed to make cooking fun and easy for everyone, from beginners to seasoned chefs.

## Project Structure

```bash
GROQ_WITH_NODE/
├── model/
│ ├── SearchHistory.js
│ ├── user.js
│ └── userFeedbacks.js
├── public/
│ ├── images/
│ ├── styles/
│ └── javascripts/
├── views/
├── server.js
├── app.js
├── env.js
├── package.json
└── README.md
```


## Features

- **User Authentication**: Powered by Passport.js, ensuring secure and smooth user login and registration.
- **User Dashboard**: Clean and simple UI where users can input prompts and get quick recipe suggestions using the incredibly fast Groq API (629 tokens/sec!).
- **History Section**: Stores all user prompts in our MongoDB collection for easy reference and inspiration.
- **Feedback Support**: Users can provide feedback on their experience, with a toast notification confirming submission.
- **Profile Management**: Basic CRUD operations for user profiles, with flash messages for successful and error notifications.

## Technologies Used

- **Frontend**: EJS templating, SCSS, Bootstrap, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with collections for Users, Search History, and User Feedback

### Notable Packages

- `passport.js` for authentication
- `nodemailer` for sending registration emails
- `connect-flash` for flash messages
- `mongoose` for database interactions
- `groq-sdk` for fast response generation

