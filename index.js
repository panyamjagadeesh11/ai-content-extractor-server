const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY;
console.log("API Key from env:", apiKey ? "***" + apiKey : "API Key not found in env");

// Initialize GoogleGenerativeAI without the key here for now
const genAI = new GoogleGenerativeAI(apiKey);
console.log("genAI object (without key initially):", genAI);

async function extractTextFromURL(url) {
    // ... your existing extractTextFromURL code ...
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const text = $('body').text().replace(/\s+/g, ' ').slice(0, 4000);

    const prompt = `Summarize the following webpage content and list key points:\n\n${text}`;
    console.log(prompt);

    return prompt//"explain about java programming";
}

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

app.post('/api/summarize', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required.' });
        }

        const extractedText = await extractTextFromURL(url);
        if (!extractedText) {
            return res.status(500).json({ error: 'Failed to extract content from the URL.' });
        }

        const aiResponse = await generateSummaryAndKeyPoints(extractedText);
        console.log(aiResponse, "aiResponse");

        res.json({ url, extractedText: extractedText.slice(0, 500) + '...', ...aiResponse });

    } catch (error) {
        console.log(error.message, 'error message');

    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});