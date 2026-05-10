const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

async function listModels() {
  let apiKey = "";
  try {
    const env = fs.readFileSync(".env.local", "utf8");
    const match = env.match(/GEMINI_API_KEY=([^\r\n]+)/);
    if (match) apiKey = match[1];
  } catch (e) {}

  if (!apiKey) return;

  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // There isn't a direct listModels in the JS SDK that works this way easily without a custom fetch
    // But we can try a different model name like 'gemini-1.0-pro'
    console.log("🛰️ Testing gemini-1.0-pro...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    const result = await model.generateContent("test");
    const response = await result.response;
    console.log("✅ Success! gemini-1.0-pro Response:", response.text());
  } catch (err) {
    console.error("❌ gemini-1.0-pro failed:", err.message);
  }
}

listModels();
