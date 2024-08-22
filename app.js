"use strict";
const Groq = require("groq-sdk");
const fs = require('fs');
require('dotenv').config();
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
async function main(userPrompt) {

    let mainPrompt = `Remember you are a recipe generator model , Remember you have to reply those all questions or queries releated to food and recipies even if someone ask about hy how are you just say hey i am here to help u suggest and give recipes of great foods and stuff like that and just reject all that questions which are not releated to food and recipes Remember deny all the answers of the questions which is not releated to the food and recipes just discard that answers and tell them that you are an recipe generator model , so here the prompt ${userPrompt}`;
    
    const chatCompletion = await getGroqChatCompletion(mainPrompt);
    saveDetails(userPrompt)
    return chatCompletion.choices[0]?.message?.content || "";
}
async function saveDetails(prompt) {
    let initialInstruction = "also show the Calories , Protein , Fat , Carbohydrates  and Sugar percentage of this dish also give a proper neutrationist chart for this dish"
    let mainPrompt = prompt + initialInstruction;
    let getNtritionAnalysis = await getGroqChatCompletion(mainPrompt);
    let saveData = getNtritionAnalysis.choices[0]?.message?.content;
    savePromptToFile(saveData);
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


function savePromptToFile(content) {
    const filePath = './nutrition_analysis.md'; 
    const dataToSave = `# Nutrition Analysis Prompt\n\n${content}\n\n`; 

    fs.writeFileSync(filePath, dataToSave, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Prompt saved to neution_analysis.md');
        }
    });
}

module.exports = {
    main,
    getGroqChatCompletion
};

