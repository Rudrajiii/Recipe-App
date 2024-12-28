"use strict";
const Groq = require("groq-sdk");
const fs = require('fs');
require('dotenv').config();
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function main(userPrompt) {
    //Bug fixded for empty input parameter;
    if(!userPrompt){
        return "Please enter a query To generate something tasty🍔🍟"
    }
    

    //system prompt for this llm model
    let mainPrompt = `Remember you are a recipe generator model , Remember you have to reply those all questions or queries releated to food and recipies even if someone ask about hy how are you just say hey i am here to help u suggest and give recipes of great foods and stuff like that and just reject all that questions which are not releated to food and recipes Remember deny all the answers of the questions which is not releated to the food and recipes just discard that answers and tell them that you are an recipe generator model , so here the prompt ${userPrompt}`;

    const chatCompletion = await getGroqChatCompletion(mainPrompt);
    saveDetails(userPrompt)
    return chatCompletion.choices[0]?.message?.content || "";
}
async function saveDetails(prompt) {
    let initialInstruction = `
    Generate a detailed nutritional analysis for the given dish or recipe in a structured JSON format. Follow these rules strictly:
    1) If the input is not related to food or recipes, return the following JSON:
    {
        "error": "Input is not food-related."
    }
    2) JSON object will allways be in 3 backtick json and in end 3 backtick so the json object can be highlighted as well.
    3)If the input is food-related, ensure the JSON includes these exact key names and structure:
    {
        "calories": "Total Calories in kcal",
        "macronutrients": {
            "protein": {"amount": "g", "percent_dv": "%"},
            "fat": {"amount": "g", "percent_dv": "%"},
            "carbohydrates": {"amount": "g", "percent_dv": "%"},
            "sugar": {"amount": "g", "percent_dv": "%"}
        },
        "micronutrients": {
            "vitamins": "List of vitamins with amounts and %DV",
            "minerals": "List of minerals like Calcium, Iron, etc., with amounts and %DV"
        },
        "dietary_fiber": {"amount": "g", "percent_dv": "%"},
        "cholesterol": {"amount": "mg", "percent_dv": "%"},
        "sodium": {"amount": "mg", "percent_dv": "%"},
        "other_components": {
            "trans_fats": "g",
            "saturated_fats": "g",
            "additional_info": "Any other relevant components"
        },
        "health_effects": "Brief description of health impacts based on the nutritional profile."
    }
    4)Ensure the JSON format is clean, machine-readable, and consistent for easy data parsing and graph plotting.
    5)Avoid creating a JSON structure for non-food-related inputs, and always return the "error" key in such cases.
    6)At last provide some image links of that particular dish. and make sure it should not be in that json object.
    `
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
