const dotenv = require('dotenv');
dotenv.config();

const tavilyKey = process.env.TAVILY_API_KEY;
console.log('Tavily Key:', tavilyKey ? tavilyKey.substring(0, 10) : 'NONE');

fetch('https://api.tavily.com/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    api_key: tavilyKey,
    query: 'food waste reduction startup',
    max_results: 5
  })
})
.then(res => res.json())
.then(data => console.log('Tavily Result count:', data.results ? data.results.length : 0, 'Data:', JSON.stringify(data).substring(0, 300)))
.catch(err => console.error('Tavily error:', err));
