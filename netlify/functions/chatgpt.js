
const https = require("https");

exports.handler = async function(event) {
  const { question } = JSON.parse(event.body || '{}');
  if (!question) {
    return { statusCode: 400, body: JSON.stringify({ error: "No question provided." }) };
  }

  const payload = JSON.stringify({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful assistant for AgriNexus users." },
      { role: "user", content: question }
    ]
  });

  const options = {
    hostname: "api.openai.com",
    path: "/v1/chat/completions",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let body = "";
      res.on("data", chunk => (body += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(body);
          const answer = json.choices?.[0]?.message?.content || "응답이 없습니다.";
          resolve({ statusCode: 200, body: JSON.stringify({ answer }) });
        } catch (e) {
          resolve({ statusCode: 500, body: JSON.stringify({ error: "응답 파싱 실패", details: e.message }) });
        }
      });
    });
    req.on("error", err => reject({ statusCode: 500, body: JSON.stringify({ error: err.message }) }));
    req.write(payload);
    req.end();
  });
};
