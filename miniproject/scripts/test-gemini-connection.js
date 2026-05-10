const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

async function testGemini() {
  let apiKey = "";
  try {
    const env = fs.readFileSync(".env.local", "utf8");
    const match = env.match(/GEMINI_API_KEY=([^\r\n]+)/);
    if (match) apiKey = match[1];
  } catch (e) {
    console.error("❌ Could not read .env.local");
  }

  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY not found in .env.local");
    return;
  }

  console.log("🔑 Using API Key:", apiKey.substring(0, 5) + "...");
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    console.log("🛰️ Testing gemini-1.5-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello world in JSON: { \"msg\": \"hello\" }");
    const response = await result.response;
    console.log("✅ Success! Response:", response.text());
  } catch (err) {
    console.error("❌ gemini-1.5-flash failed:", err.message);
    
    console.log("🛰️ Testing gemini-pro...");
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("Say hello world in JSON");
      const response = await result.response;
      console.log("✅ Success! gemini-pro Response:", response.text());
    } catch (err2) {
      console.error("❌ gemini-pro failed:", err2.message);
    }
  }
}

testGemini();
