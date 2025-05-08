
const fetch = require('node-fetch');

exports.handler = async function (event) {
  const { question } = JSON.parse(event.body);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for AgriNexus users.' },
        { role: 'user', content: question }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || "답변을 가져오지 못했습니다.";
  return {
    statusCode: 200,
    body: JSON.stringify({ answer })
  };
};
