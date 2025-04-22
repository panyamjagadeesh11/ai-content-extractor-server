// const axios = require('axios');
// const cheerio = require('cheerio');
// const { OpenAI } = require('openai');
// require('dotenv').config();

// const obj = { apiKey: process.env.OPENAI_API_KEY }
// console.log(obj, "qwertyu");

// const openai = new OpenAI(obj);

// async function summarizeContent(url) {
//   try {
//     // const response = await axios.get(url);
//     // const $ = cheerio.load(response.data);
//     // const text = $('body').text().replace(/\s+/g, ' ').slice(0, 4000);
  
//     // const prompt = `Summarize the following webpage content and list key points:\n\n${text}`;
  
//     // const aiRes = await openai.chat.completions.create({
//     //   model: 'gpt-3.5-turbo',
//     //   messages: [{ role: 'user', content: prompt }],
//     // });
  
//     // return aiRes.choices[0].message.content;

//     return {
//       "summary": [
//         { "title": "Intro", "point": "This is the introduction." },
//         { "title": "Details", "point": "Details about the topic." },
//         { "title": "Conclusion", "point": "Final takeaway." }
//       ]
//     }
      
//   } catch (error) {
//     console.log(error, "error");
//     return error;
        
//   }
// }

// module.exports = { summarizeContent };

const cheerio = require('cheerio');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.OPENAI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

async function summarizeContent(url) {
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    const content = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 10000);

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent(`Summarize the following webpage content into key points:\n\n${content}`);
    const response = await result.response;
    const text = response.text();

    return { summary: text };
  } catch (err) {
    console.error("Summarization error:", err);
    return { error: "Failed to summarize content." };
  }
}

module.exports = { summarizeContent };
