"use strict";
const Groq = require("groq-sdk");
require('dotenv').config();
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
async function main(userPrompt) {
    const chatCompletion = await getGroqChatCompletion(userPrompt);

    return chatCompletion.choices[0]?.message?.content || "";
}
async function getGroqChatCompletion(userPrompt) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: userPrompt,
            }
        ],
        model: "mixtral-8x7b-32768"
    });
}

// main()

module.exports = {
    main,
    getGroqChatCompletion
};

