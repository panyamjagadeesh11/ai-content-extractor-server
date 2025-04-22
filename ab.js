const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);

async function summarize() {
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });

    const result = await model.generateContent(
      "Summarize this article about artificial intelligence in 3 key points."
    );

    const response = result.response;
    console.log("Summary:\n", response.text());
  } catch (err) {
    console.error("Error:", err.message);
  }
}

summarize();
