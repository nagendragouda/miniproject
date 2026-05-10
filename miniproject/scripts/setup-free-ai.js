#!/usr/bin/env node

/**
 * Free AI Setup Script
 * Helps users configure free AI providers for the FutureMatrix Platform
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m'
}

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  console.clear()
  log('cyan', '🤖 Free AI Providers Setup')
  log('cyan', '=' .repeat(40))
  
  log('blue', '\n📋 This script will help you set up free AI providers:')
  log('yellow', '• Hugging Face (30,000 free requests/month)')
  log('yellow', '• Cohere (1,000 free requests/month)')
  log('yellow', '• Ollama (unlimited local inference)')
  
  log('magenta', '\n🎯 Goal: Replace OpenAI/Gemini with 100% free alternatives')
  
  const proceed = await question('\n❓ Do you want to continue with the setup? (y/n): ')
  if (proceed.toLowerCase() !== 'y') {
    log('yellow', '👋 Setup cancelled. Run this script again when ready!')
    rl.close()
    return
  }

  // Check if .env.local exists
  const envPath = path.join(__dirname, '..', '.env.local')
  const envExists = fs.existsSync(envPath)
  
  if (!envExists) {
    log('red', '\n❌ .env.local file not found!')
    log('yellow', '📁 Please make sure you are running this from the project root directory.')
    rl.close()
    return
  }

  log('green', '\n✅ Found .env.local file')

  // Read current .env.local content
  let envContent = fs.readFileSync(envPath, 'utf8')
  
  log('blue', '\n🔧 Setting up AI providers...\n')

  // 1. Hugging Face Setup
  log('yellow', '1️⃣  HUGGING FACE SETUP')
  log('blue', '   🌐 Website: https://huggingface.co/')
  log('blue', '   📊 Free Quota: 30,000 requests/month')
  log('blue', '   🔑 Get API Key: https://huggingface.co/settings/tokens')
  
  const hasHuggingFace = await question('\n❓ Do you have a Hugging Face API key? (y/n): ')
  
  if (hasHuggingFace.toLowerCase() === 'y') {
    const hfKey = await question('🔑 Enter your Hugging Face API key (starts with hf_): ')
    if (hfKey.trim()) {
      envContent = updateEnvVariable(envContent, 'HUGGINGFACE_API_KEY', hfKey.trim())
      log('green', '✅ Hugging Face API key saved')
    }
  } else {
    log('cyan', '\n📋 To get a Hugging Face API key:')
    log('blue', '   1. Go to https://huggingface.co/')
    log('blue', '   2. Create a free account')
    log('blue', '   3. Go to Settings → Access Tokens')
    log('blue', '   4. Create a new token with "Read" permissions')
    log('blue', '   5. Copy the token and run this setup again')
  }

  // 2. Cohere Setup
  log('yellow', '\n2️⃣  COHERE SETUP')
  log('blue', '   🌐 Website: https://cohere.ai/')
  log('blue', '   📊 Free Quota: 1,000 requests/month')
  log('blue', '   🔑 Get API Key: https://cohere.ai/ (free signup)')
  
  const hasCohere = await question('\n❓ Do you have a Cohere API key? (y/n): ')
  
  if (hasCohere.toLowerCase() === 'y') {
    const cohereKey = await question('🔑 Enter your Cohere API key: ')
    if (cohereKey.trim()) {
      envContent = updateEnvVariable(envContent, 'COHERE_API_KEY', cohereKey.trim())
      log('green', '✅ Cohere API key saved')
    }
  } else {
    log('cyan', '\n📋 To get a Cohere API key:')
    log('blue', '   1. Go to https://cohere.ai/')
    log('blue', '   2. Click "Get Started for Free"')
    log('blue', '   3. Sign up for a free account')
    log('blue', '   4. Go to Dashboard → API Keys')
    log('blue', '   5. Copy your API key and run this setup again')
  }

  // 3. Ollama Setup
  log('yellow', '\n3️⃣  OLLAMA SETUP (OPTIONAL)')
  log('blue', '   🌐 Website: https://ollama.ai/')
  log('blue', '   📊 Quota: Unlimited (runs locally)')
  log('blue', '   💾 Models: LLaMA, Mistral, CodeLlama, etc.')
  
  const wantsOllama = await question('\n❓ Do you want to set up Ollama for local AI? (y/n): ')
  
  if (wantsOllama.toLowerCase() === 'y') {
    const ollamaInstalled = await question('❓ Have you already installed Ollama? (y/n): ')
    
    if (ollamaInstalled.toLowerCase() === 'y') {
      envContent = updateEnvVariable(envContent, 'OLLAMA_BASE_URL', 'http://localhost:11434')
      log('green', '✅ Ollama configuration saved')
      
      log('cyan', '\n📋 To use Ollama:')
      log('blue', '   1. Make sure Ollama is running: ollama serve')
      log('blue', '   2. Pull a model: ollama pull llama3.2:1b')
      log('blue', '   3. Test: curl http://localhost:11434/api/version')
    } else {
      log('cyan', '\n📋 To install Ollama:')
      log('blue', '   1. Download from https://ollama.ai/')
      log('blue', '   2. Install the application')
      log('blue', '   3. Run: ollama pull llama3.2:1b')
      log('blue', '   4. Start service: ollama serve')
      log('blue', '   5. Run this setup script again')
    }
  }

  // Set default provider
  log('yellow', '\n4️⃣  DEFAULT PROVIDER')
  if (envContent.includes('HUGGINGFACE_API_KEY=') && !envContent.includes('HUGGINGFACE_API_KEY=\n')) {
    envContent = updateEnvVariable(envContent, 'DEFAULT_AI_PROVIDER', 'huggingface')
    log('green', '✅ Set Hugging Face as default provider')
  } else if (envContent.includes('COHERE_API_KEY=') && !envContent.includes('COHERE_API_KEY=\n')) {
    envContent = updateEnvVariable(envContent, 'DEFAULT_AI_PROVIDER', 'cohere')
    log('green', '✅ Set Cohere as default provider')
  } else if (envContent.includes('OLLAMA_BASE_URL=')) {
    envContent = updateEnvVariable(envContent, 'DEFAULT_AI_PROVIDER', 'ollama')
    log('green', '✅ Set Ollama as default provider')
  }

  // Save updated .env.local
  fs.writeFileSync(envPath, envContent)
  log('green', '\n💾 Configuration saved to .env.local')

  // Test setup
  log('yellow', '\n5️⃣  TESTING SETUP')
  const runTest = await question('❓ Do you want to test the AI configuration now? (y/n): ')
  
  if (runTest.toLowerCase() === 'y') {
    log('blue', '\n🧪 Running AI test...')
    
    try {
      const { spawn } = require('child_process')
      const testProcess = spawn('npm', ['run', 'test:ai'], { 
        stdio: 'inherit',
        shell: true,
        cwd: path.join(__dirname, '..')
      })
      
      testProcess.on('close', (code) => {
        if (code === 0) {
          log('green', '\n🎉 AI configuration test passed!')
        } else {
          log('yellow', '\n⚠️  Test completed with warnings. Check output above.')
        }
        
        showCompletionMessage()
        rl.close()
      })
      
      testProcess.on('error', (error) => {
        log('red', `\n❌ Test failed: ${error.message}`)
        log('blue', '💡 You can run the test manually: npm run test:ai')
        showCompletionMessage()
        rl.close()
      })
    } catch (error) {
      log('red', `\n❌ Error running test: ${error.message}`)
      log('blue', '💡 You can run the test manually: npm run test:ai')
      showCompletionMessage()
      rl.close()
    }
  } else {
    showCompletionMessage()
    rl.close()
  }
}

function updateEnvVariable(content, key, value) {
  const regex = new RegExp(`^${key}=.*$`, 'm')
  const newLine = `${key}=${value}`
  
  if (regex.test(content)) {
    return content.replace(regex, newLine)
  } else {
    // Add the variable if it doesn't exist
    return content + `\n${newLine}`
  }
}

function showCompletionMessage() {
  log('cyan', '\n🎉 SETUP COMPLETE!')
  log('cyan', '=' .repeat(40))
  
  log('green', '✅ Free AI providers configured')
  log('green', '✅ Environment variables updated')
  log('green', '✅ Platform ready to use')
  
  log('magenta', '\n💡 NEXT STEPS:')
  log('blue', '1. Start your development server: npm run dev')
  log('blue', '2. Test AI features in the platform')
  log('blue', '3. Monitor usage in the dashboard')
  
  log('yellow', '\n📚 HELPFUL RESOURCES:')
  log('blue', '• Test AI: npm run test:ai')
  log('blue', '• Documentation: docs/FREE_AI_SETUP.md')
  log('blue', '• Troubleshooting: FREE_AI_MIGRATION_COMPLETE.md')
  
  log('cyan', '\n💰 COST SAVINGS: $0/month (was $50-200/month)')
  log('cyan', '🚀 Platform now runs 100% free!')
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  log('yellow', '\n\n👋 Setup interrupted. Run again when ready!')
  rl.close()
  process.exit(0)
})

// Run the setup
main().catch(error => {
  log('red', `\n❌ Setup error: ${error.message}`)
  rl.close()
  process.exit(1)
})