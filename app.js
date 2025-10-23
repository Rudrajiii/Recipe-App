"use strict";
const Groq = require("groq-sdk");
const fs = require('fs');
require('dotenv').config();
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function main(userPrompt) {
    //system prompt for this llm model
    let mainPrompt = `Remember you are a recipe generator model , Remember you have to reply those all questions or queries releated to food and recipies even if someone ask about hy how are you just say hey i am here to help u suggest and give recipes of great foods and stuff like that and just reject all that questions which are not releated to food and recipes Remember deny all the answers of the questions which is not releated to the food and recipes just discard that answers and tell them that you are an recipe generator model , so here the prompt ${userPrompt}`;

    const chatCompletion = await getGroqChatCompletion(mainPrompt);
    // Generate nutritional analysis
    const analysis = await saveDetails(userPrompt);
    return {
        apiData: chatCompletion.choices[0]?.message?.content || "",
        analysis: analysis
    };
}
async function saveDetails(prompt) {
    let initialInstruction = `
    Generate a detailed nutritional analysis for the given dish or recipe in a structured JSON format. Follow these rules strictly:
    1) If the input is not related to food or recipes, return the following JSON:
    {
        "error": "Input is not food-related."
    }
    2) JSON object will allways be in 3 backtick json and in end 3 backtick so the json object can be highlighted as well.
    3) If the input is food-related , Generate a detailed nutritional analysis for the given dish or recipe in the following JSON format make sure  use exact key names and structure:
    {
    "calories": "Total Calories in kcal (e.g., '200 kcal')",
    "macronutrients": {
        "protein": { "amount": "Protein amount in grams (e.g., '10 g')", "percent_dv": "Percent Daily Value (e.g., '20%')" },
        "fat": { "amount": "Fat amount in grams (e.g., '8 g')", "percent_dv": "Percent Daily Value (e.g., '12%')" },
        "carbohydrates": { "amount": "Carbohydrates amount in grams (e.g., '30 g')", "percent_dv": "Percent Daily Value (e.g., '10%')" },
        "sugar": { "amount": "Sugar amount in grams (e.g., '5 g')", "percent_dv": "Percent Daily Value (e.g., '8%')" }
    },
    "micronutrients": {
        "vitamins": "Comma-separated list of vitamins with amounts and %DV (e.g., 'Vitamin C: 10 mg, Vitamin A: 50 μg')",
        "minerals": "Comma-separated list of minerals with amounts and %DV (e.g., 'Calcium: 100 mg, Iron: 2 mg')"
    },
    "dietary_fiber": { "amount": "Fiber amount in grams (e.g., '4 g')", "percent_dv": "Percent Daily Value (e.g., '16%')" },
    "cholesterol": { "amount": "Cholesterol amount in milligrams (e.g., '20 mg')", "percent_dv": "Percent Daily Value (e.g., '7%')" },
    "sodium": { "amount": "Sodium amount in milligrams (e.g., '300 mg')", "percent_dv": "Percent Daily Value (e.g., '12%')" },
    "other_components": {
        "trans_fats": "Trans fats amount in grams (e.g., '0 g')",
        "saturated_fats": "Saturated fats amount in grams (e.g., '2 g')",
        "additional_info": "Any other relevant components (e.g., 'Contains wheat, soy, and corn ingredients')"
    },
    "health_effects": "Brief description of health impacts based on the nutritional profile (e.g., 'High in fiber and low in saturated fats.')"
    }
    4)Ensure the JSON format is clean, machine-readable, and consistent for easy data parsing and graph plotting.
    5)Avoid creating a JSON structure for non-food-related inputs, and always return the "error" key in such cases.
    `
    let mainPrompt = prompt + initialInstruction;
    let getNtritionAnalysis = await getGroqChatCompletion(mainPrompt);
    let saveData = getNtritionAnalysis.choices[0]?.message?.content;
    // savePromptToFile(saveData);
    return saveData;
}
async function getGroqChatCompletion(userPrompt) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: userPrompt,
            }
        ],
        model: "llama-3.3-70b-versatile"
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
