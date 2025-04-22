const { generateSummaryAndKeyPoints } = require('./utils/generateSummaryAndKeyPoints');
const extractTextFromURL = require('./utils/extractTextFromURL');
require('dotenv').config();

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

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
    res.json({
      url,
      extractedText: extractedText.slice(0, 500) + '...',
      ...aiResponse,
    });
  } catch (error) {
    console.error(error.message, 'Error');
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
