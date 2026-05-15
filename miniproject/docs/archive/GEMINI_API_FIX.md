# Resume Analyzer - Gemini API Fix Guide

## Error Summary

```
404 Not Found: models/gemini-1.5-flash is not found for API version v1beta, 
or is not supported for generateContent
```

## Root Causes

The error indicates one of these issues:

1. **Invalid API Key** - Your `GEMINI_API_KEY` is incorrect or expired
2. **Model Not Available** - The model name is incorrect or not available in your tier
3. **Account Not Activated** - Your Google account hasn't been activated for Generative AI API
4. **Regional Restrictions** - Your region may not support the model

## Solution Steps

### Step 1: Verify Your API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key or copy an existing one
3. Update your `.env.local` file:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### Step 2: Test Available Models

Run the diagnostic script to see which models are available:

```bash
node scripts/test-gemini-models.js
```

This will show you which models your API key can access:
- ✅ gemini-1.5-flash
- ✅ gemini-1.5-pro
- ✅ gemini-pro
- etc.

### Step 3: What We Fixed

The code now:
- **Auto-detects available models** - Tries `gemini-1.5-flash` first, then falls back to `gemini-1.5-pro`
- **Better error messages** - Explains exactly what went wrong
- **Improved error handling** - Validates the API response properly

## Updated Model Selection Priority

```
1. gemini-1.5-flash (fastest, best for most use cases)
   ↓ (if not available)
2. gemini-1.5-pro (more powerful, better for complex analysis)
   ↓ (if not available)
3. gemini-pro (older, slower, but widely available)
```

## Configuration Checklist

- [ ] API Key is set in `.env.local`
- [ ] API Key is valid (starts with `AIza...`)
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/) and enable "Generative Language API"
- [ ] Run `node scripts/test-gemini-models.js` to verify
- [ ] Restart your dev server: `npm run dev`

## Testing the Fix

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Go to resume analyzer:**
   ```
   http://localhost:3000/resume-analyzer
   ```

3. **Upload a PDF resume and analyze** - Should work now!

## Still Having Issues?

If you still see errors, check:

1. **Console output** in your terminal - Look for which model is being used
2. **API Key validity** - Visit [makersuite.google.com](https://makersuite.google.com/app/apikey)
3. **API enablement** - Check [Google Cloud Console](https://console.cloud.google.com/) for API status
4. **Network connectivity** - Verify you can reach `generativelanguage.googleapis.com`

## Alternative Solutions

If Gemini models are still not working:

1. **Use OpenAI's API** - Switch to GPT-4 (if you have access)
2. **Use Cohere API** - Alternative LLM provider
3. **Use HuggingFace** - Free inference endpoint

Let me know which solution you'd like to explore!
