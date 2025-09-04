# PR: Fix API Key Configuration and Add Claude 4 Models

## Summary
Fixes critical issue where chat system wouldn't respond without manually entering API keys in UI, and adds missing Claude 4 models.

## Problem
Users reported that even with `ANTHROPIC_API_KEY` set in environment variables, the chat system would not respond unless they manually entered the API key in the UI settings.

## Root Cause
1. LLM providers were initialized with empty API keys during user registration
2. System attempted to decrypt empty strings, failing without fallback
3. Anthropic model list was missing Claude 4 and 3.7 models

## Changes

### 🔑 API Key Configuration Fix
- **Implemented proper fallback chain**: Database → Environment Variables
- **Added graceful error handling** for decryption failures
- **Removed confusing deployment environment checks**
- **Added clear error messages** when API keys are missing

### 🤖 Model Updates
- **Added Claude 4 Opus** (claude-opus-4-20250514)
- **Added Claude 4 Sonnet** (claude-sonnet-4-20250514)
- **Added Claude 3.7 Sonnet** (claude-3-7-sonnet-20250219)
- **Updated cloud filter** to include new models

## Technical Implementation

### Before
```javascript
// Would fail if database had empty API key
if (currentDeploymentEnv === 'local') {
    apiKey = decrypt(llmProvider.apiKey) // Throws on empty
} else if (currentDeploymentEnv === 'cloud') {
    apiKey = process.env.ANTHROPIC_API_KEY
}
```

### After
```javascript
// Graceful fallback chain
if (llmProvider.apiKey) {
    try {
        apiKey = decrypt(llmProvider.apiKey)
    } catch (e) {
        console.log('Failed to decrypt, trying env vars')
    }
}
if (!apiKey) {
    apiKey = process.env.ANTHROPIC_API_KEY || ''
}
```

## Files Modified
- `/src/app/api/llm-providers/[id]/models/route.ts`
- `/src/app/api/chat-rooms/[id]/messages/route.ts`

## Testing
✅ Build passes without errors
✅ API keys from environment variables work
✅ API keys from UI still work
✅ Claude 4 models appear in dropdown
✅ Clear error messages when keys missing

## Breaking Changes
None - Fully backward compatible

## Commits
- `589a8a9` - fix: Add missing Anthropic Claude 4 and 3.7 models
- `167bb8a` - fix: Add environment variable fallback for API keys

## Deployment
```bash
# Set in environment or .env file:
ANTHROPIC_API_KEY=sk-ant-xxx
OPENAI_API_KEY=sk-xxx  
GOOGLE_API_KEY=xxx

# No UI configuration needed anymore!
```

## Result
- Chat works immediately after deployment with env vars
- No manual API key entry required
- All latest Anthropic models available
- Better error messages for troubleshooting