const fs = require("fs");

async function testCohere() {
  let apiKey = "";
  try {
    const env = fs.readFileSync(".env.local", "utf8");
    const match = env.match(/COHERE_API_KEY=([^\r\n]+)/);
    if (match) apiKey = match[1];
  } catch (e) {}

  if (!apiKey) {
    console.error("❌ COHERE_API_KEY not found");
    return;
  }

  console.log("🔑 Using Cohere Key:", apiKey.substring(0, 5) + "...");
  
  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command",
        prompt: "Say hello world",
        max_tokens: 10
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Cohere Success! Response:", data.generations[0].text);
    } else {
      console.error("❌ Cohere Failed:", response.status, await response.text());
    }
  } catch (err) {
    console.error("❌ Cohere Request Error:", err.message);
  }
}

testCohere();
