const dotenv = require('dotenv');
dotenv.config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGroundingSearch() {
  const key = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';

  console.log('Testing with key starting:', key ? key.substring(0, 8) : 'NONE', 'Model:', modelName);

  const genAI = new GoogleGenerativeAI(key);
  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      tools: [{ googleSearch: {} }]
    });

    const res = await model.generateContent('Search for: food waste reduction startups');
    console.log('Success response text:', res.response.text());
    console.log('Grounding metadata:', JSON.stringify(res.response.candidates?.[0]?.groundingMetadata, null, 2));
  } catch (err) {
    console.error('ERROR during grounding search:', err.message);
  }
}

testGroundingSearch();
