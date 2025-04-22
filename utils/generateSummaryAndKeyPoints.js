require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const apiKey = process.env.OPENAI_API_KEY;
console.log("API Key from env:", apiKey ? "***" + apiKey.slice(-5) : "API Key not found in env");

// Initialize GoogleGenerativeAI without the key here for now
const genAI = new GoogleGenerativeAI(apiKey);
console.log("genAI object (without key initially):", genAI);

async function generateSummaryAndKeyPoints(text) {
    console.log("Inside generateSummaryAndKeyPoints");
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        apiKey: apiKey,
        apiEndpoint: "generativelanguage.googleapis.com",
        apiVersion: "v1"
    });
    console.log("Model instance:", model);
    if (!model) {
        return { summary: 'Model not initialized correctly.', keyPoints: [] };
    }
    try {
        const prompt = `Summarize the following text and extract 3 key points:\n\n${text}\n\nSummary:\nKey Points:\n1. and any point have just stars(*) alone leave that point`;
        console.log(prompt);

        const result = await model.generateContent({
            contents: [{
                parts: [{ text: prompt }]
            }]
        });
        console.log(result, "result");

        const responseText1 = await result.response;
        // const textValue = responseText1.text();
        // console.log(textValue, "textValue");
        // console.log(responseText1?.candidates?.[0]?.content?.parts?.[0]?.text);
        
        const responseText = responseText1?.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log(responseText, "responseText");
        
        if (responseText) {
            const parts = responseText.split('Key Points:');
            const summary = (parts[0] || '').trim().replace('Summary:', '').trim();
            const keyPointsRaw = (parts[1] || '').trim().split('\n').map(p => p.trim()).filter(p => p !== '' && !/^\d+\.\s*$/.test(p));
            const keyPoints = keyPointsRaw.slice(0, 3);

            return { summary, keyPoints };
        } else {
            return { summary: 'Could not generate summary.', keyPoints: [] };
        }
    } catch (error) {
        console.error('Error during generateContent:', error);
        return { summary: 'Error generating summary.', keyPoints: [] };
    }
}

module.exports = {generateSummaryAndKeyPoints}