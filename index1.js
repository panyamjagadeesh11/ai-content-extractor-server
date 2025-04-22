const express = require('express');
const cors = require('cors');
const { summarizeContent } = require('./utils/fetchAndSummarize.js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/summarize', async (req, res) => {
  const { url } = req.body;
  console.log(url, "url");
  
  try {
    const result = await summarizeContent(url);
    res.json( result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(8080, () => console.log('✅ Server running on http://localhost:8080'));
