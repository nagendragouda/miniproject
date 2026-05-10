#!/usr/bin/env node

/**
 * Test Gemini API availability and list available models
 * Usage: node scripts/test-gemini-models.js
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyD7QScqbBvcM1yYNqq7aKXlIybeErYcQcE';

if (!apiKey) {
  console.error('❌ ERROR: GEMINI_API_KEY is not set in environment variables');
  console.error('Please add GEMINI_API_KEY to your .env.local file');
  process.exit(1);
}

console.log('🔍 Testing Gemini API Configuration...\n');

const genAI = new GoogleGenerativeAI(apiKey);

// List of models to test
const modelsToTest = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
];

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    // Try a simple request
    const result = await model.generateContent('{"test": "response"}');
    const response = await result.response;
    console.log(`✅ ${modelName}: AVAILABLE`);
    return true;
  } catch (error) {
    const errorMsg = error.message || error;
    if (errorMsg.includes('404') || errorMsg.includes('not found')) {
      console.log(`❌ ${modelName}: NOT FOUND/NOT SUPPORTED`);
    } else if (errorMsg.includes('401') || errorMsg.includes('authentication')) {
      console.log(`❌ ${modelName}: AUTHENTICATION ERROR (Invalid API Key)`);
    } else if (errorMsg.includes('429') || errorMsg.includes('quota')) {
      console.log(`⚠️  ${modelName}: QUOTA EXCEEDED`);
    } else {
      console.log(`⚠️  ${modelName}: ERROR - ${errorMsg.substring(0, 100)}`);
    }
    return false;
  }
}

async function main() {
  console.log(`Testing API Key: ${apiKey.substring(0, 10)}...\n`);

  let anyAvailable = false;
  for (const model of modelsToTest) {
    const available = await testModel(model);
    if (available) anyAvailable = true;
  }

  console.log('\n' + '='.repeat(60));

  if (!anyAvailable) {
    console.log('❌ No models available. Possible causes:\n');
    console.log('1. Invalid API Key');
    console.log('2. API Key with insufficient permissions');
    console.log('3. Account not activated for Generative AI API');
    console.log('4. Regional restrictions\n');
    console.log('📌 SOLUTION:');
    console.log('- Go to https://makersuite.google.com/app/apikey');
    console.log('- Create a new API key for the Generative AI API');
    console.log('- Update GEMINI_API_KEY in .env.local');
  } else {
    console.log('✅ At least one model is available!');
  }
}

main().catch(console.error);
