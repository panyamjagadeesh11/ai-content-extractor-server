const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { generateSummaryAndKeyPoints } = require('./utils/generateSummaryAndKeyPoints');
const extractTextFromURL = require('./utils/extractTextFromURL');


const port = process.env.PORT || 8080;


// Vercel Serverless Function Handler
module.exports = async (req, res) => {
    const app = express(); // Create a new express app instance for each invocation
    const corsOptions = {
        origin: '*', // Allow all origins (less secure for production)
    };
    app.use(cors(corsOptions));
    app.use(express.json());
    // app.post('/api/summarize', async (req, res) => {

    if (req.method === 'POST' && req.url === '/api/summarize') {
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
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    // })
    } else {
        res.status(404).send('Not Found');
    }
};

// app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
// });