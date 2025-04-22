const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { generateSummaryAndKeyPoints } = require('./utils/generateSummaryAndKeyPoints');
const extractTextFromURL = require('./utils/extractTextFromURL');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY;
console.log("API Key from env:", apiKey ? "***" + apiKey : "API Key not found in env");

// Initialize GoogleGenerativeAI without the key here for now
const genAI = new GoogleGenerativeAI(apiKey);
console.log("genAI object (without key initially):", genAI);

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