const dotenv = require('dotenv');
dotenv.config();

async function testTavily() {
  const { tavilyWebSearchTool } = require('./dist/tools/tavily/tavilySearch.tool');
  try {
    const res = await tavilyWebSearchTool.invoke({ query: 'food waste reduction startup' });
    console.log('TAVILY RES:', res.substring(0, 300));
  } catch (err) {
    console.error('TAVILY ERR:', err);
  }
}

testTavily();
