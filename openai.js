const { OpenAI } = require('openai'); // Updated import
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // API key from your .env file
});

module.exports = openai;

