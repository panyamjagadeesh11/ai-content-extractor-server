
async function extractTextFromURL(url) {
    // ... your existing extractTextFromURL code ...
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const text = $('body').text().replace(/\s+/g, ' ').slice(0, 4000);

    const prompt = `Summarize the following webpage content and list key points:\n\n${text}`;
    console.log(prompt);

    return prompt//"explain about java programming";
}

module.exports = extractTextFromURL