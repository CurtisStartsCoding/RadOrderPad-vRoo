# LLM Configuration and Fallback Mechanism

This document describes the LLM (Large Language Model) configuration and fallback mechanism used in the RadOrderPad application.

## Overview

The RadOrderPad application uses multiple LLM providers to ensure high availability and reliability of the validation service. The system is configured to use Claude 3.7 as the primary LLM, with automatic fallback to Grok and then to OpenAI GPT if the primary provider is unavailable.

## LLM Providers

The application supports three LLM providers:

1. **Anthropic Claude** (Primary)
   - Model: `claude-3-7-sonnet-20250219`
   - API Endpoint: `https://api.anthropic.com/v1/messages`

2. **Grok** (First Fallback)
   - Model: `grok-3-latest` (aliases: `grok-3`, `grok-3-beta`)
   - API Endpoint: `https://api.x.ai/v1/chat/completions`

3. **OpenAI GPT** (Second Fallback)
   - Model: `gpt-4-turbo`
   - API Endpoint: `https://api.openai.com/v1/chat/completions`

## Configuration

The LLM configuration is defined in the `.env` file and loaded through `src/config/config.ts`:

```
# LLM API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key
GROK_API_KEY=your_grok_api_key
OPENAI_API_KEY=your_openai_api_key

# LLM Model Names
CLAUDE_MODEL_NAME=claude-3-7-sonnet-20250219
GROK_MODEL_NAME=grok-3-latest
GPT_MODEL_NAME=gpt-4-turbo

# LLM Settings
LLM_MAX_TOKENS=4000
LLM_TIMEOUT=30000
```

## Fallback Mechanism

The fallback mechanism is implemented in `src/utils/llm-client.ts` through the `callLLMWithFallback` function:

```typescript
/**
 * Call LLM with fallback logic
 * Try Claude 3.7 first, then Grok, then GPT
 */
export async function callLLMWithFallback(prompt: string): Promise<LLMResponse> {
  // Try Claude first
  try {
    return await callClaude(prompt);
  } catch (error) {
    console.log('Claude API call failed, falling back to Grok...');
    
    // Try Grok next
    try {
      return await callGrok(prompt);
    } catch (error) {
      console.log('Grok API call failed, falling back to GPT...');
      
      // Try GPT as last resort
      try {
        return await callGPT(prompt);
      } catch (error) {
        console.error('All LLM API calls failed');
        throw new Error('ValidationServiceUnavailable: All LLM providers failed');
      }
    }
  }
}
```

This function attempts to call each provider in sequence, falling back to the next provider if the current one fails.

## Supported Grok Models

The following Grok models have been tested and confirmed to work:

| Model Name | Description | Input Cost | Output Cost |
|------------|-------------|------------|-------------|
| `grok-3-beta` | Standard model | $3.00 | $15.00 |
| `grok-3` | Alias for grok-3-beta | $3.00 | $15.00 |
| `grok-3-latest` | Alias for grok-3-beta | $3.00 | $15.00 |
| `grok-3-fast-beta` | Faster model | $5.00 | $25.00 |
| `grok-3-mini-fast-beta` | Smaller, faster model | $0.60 | $4.00 |
| `grok-2-1212` | Legacy model | $2.00 | $10.00 |
| `grok-beta` | Legacy model | $5.00 | $15.00 |
| `grok-2` | Legacy model | $2.00 | $10.00 |

## Testing

The fallback mechanism can be tested using the following scripts:

1. `test-grok-models.js`: Tests different Grok model names to see which ones work.
2. `test-force-grok-fallback.js`: Forces a fallback to Grok by temporarily disabling the Anthropic API key.
3. `test-gpt-fallback.js`: Forces a fallback to GPT by temporarily disabling both Anthropic and Grok API keys.

To run these tests:

```bash
node test-grok-models.js
node test-force-grok-fallback.js
node test-gpt-fallback.js
```

## Troubleshooting

If you encounter issues with the LLM providers, check the following:

1. **API Keys**: Ensure that the API keys in the `.env` file are valid and have the necessary permissions.
2. **Model Names**: Verify that the model names in the `.env` file are correct and available to your account.
3. **Network Connectivity**: Check that your server can reach the API endpoints for each provider.
4. **Rate Limits**: Be aware of rate limits for each provider and ensure you're not exceeding them.
5. **Error Logs**: Check the application logs for specific error messages from the LLM providers.

## Updating Models

To update the models used by the application:

1. Update the model name in the `.env` file.
2. Restart the application to load the new configuration.
3. Test the new model using the provided test scripts.

## Test Mode

When running validation tests, you can use the `testMode` parameter to skip database logging:

```typescript
// Call the validation service with test mode enabled
const result = await ValidationService.runValidation(dictationText, {}, true);
```

This will prevent the validation service from attempting to log validation attempts to the database, which is useful for testing the LLM functionality without requiring a valid order ID.

## Future Enhancement Ideas

While the current implementation with a hardcoded fallback sequence (Claude → Grok → GPT) works well, there are several ways to make the provider priority more configurable without code changes in the future. These ideas are documented here for future reference.

### 1. Environment Variable Configuration

The simplest approach would be to extend the `.env` file to include provider priority settings:

```
# LLM Provider Priority (1=primary, 2=secondary, 3=tertiary)
LLM_PROVIDER_CLAUDE_PRIORITY=1
LLM_PROVIDER_GROK_PRIORITY=2
LLM_PROVIDER_GPT_PRIORITY=3
```

The application would read these values at startup and sort the providers accordingly. This approach is simple to implement and fits well with the existing configuration system.

### 2. JSON Configuration File

A more structured approach would be to create a dedicated `llm-config.json` file:

```json
{
  "providers": [
    {
      "name": "claude",
      "priority": 1,
      "model": "claude-3-7-sonnet-20250219",
      "apiKey": "${ANTHROPIC_API_KEY}",
      "endpoint": "https://api.anthropic.com/v1/messages",
      "headers": {
        "anthropic-version": "2023-06-01"
      }
    },
    {
      "name": "grok",
      "priority": 2,
      "model": "grok-3-latest",
      "apiKey": "${GROK_API_KEY}",
      "endpoint": "https://api.x.ai/v1/chat/completions"
    },
    {
      "name": "openai",
      "priority": 3,
      "model": "gpt-4-turbo",
      "apiKey": "${OPENAI_API_KEY}",
      "endpoint": "https://api.openai.com/v1/chat/completions"
    }
  ],
  "settings": {
    "maxTokens": 4000,
    "timeout": 30000
  }
}
```

This would be more readable and could include additional provider-specific settings. The JSON format also makes it easier to add new providers or configuration options in the future.

### 3. Database Configuration

For even more flexibility, the provider configuration could be stored in the database:

```sql
CREATE TABLE llm_providers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  priority INTEGER NOT NULL,
  model TEXT NOT NULL,
  api_key_env_var TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  headers JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE llm_settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);
```

This approach would allow:
- Changing the configuration without restarting the application
- Creating an admin interface to adjust settings
- Tracking changes to the configuration over time
- Caching the configuration for performance

### 4. Feature Flags Service

For enterprise-level flexibility, a feature flags service like LaunchDarkly could be used:

```javascript
const ldClient = LaunchDarkly.initialize('YOUR_SDK_KEY');

async function getLLMProviderPriority() {
  const claudePriority = await ldClient.variation('llm-claude-priority', { user: 'system' }, 1);
  const grokPriority = await ldClient.variation('llm-grok-priority', { user: 'system' }, 2);
  const gptPriority = await ldClient.variation('llm-gpt-priority', { user: 'system' }, 3);
  
  return [
    { name: 'claude', priority: claudePriority },
    { name: 'grok', priority: grokPriority },
    { name: 'openai', priority: gptPriority }
  ].sort((a, b) => a.priority - b.priority);
}
```

This would enable:
- Real-time configuration changes without deployments
- Gradual rollout of changes to specific environments or users
- A/B testing different provider configurations
- Detailed analytics on provider usage and performance

### Implementation Considerations

To implement any of these approaches, the code would need to:

1. Load the configuration at startup (or dynamically for database/feature flags)
2. Sort providers by priority
3. Try each provider in order until one succeeds

The implementation might look something like:

```typescript
async function callLLMWithDynamicFallback(prompt: string): Promise<LLMResponse> {
  // Get sorted providers based on configuration
  const providers = await getProvidersByPriority();
  
  // Try each provider in order
  let lastError = null;
  for (const provider of providers) {
    try {
      switch (provider.name) {
        case 'claude':
          return await callClaude(prompt);
        case 'grok':
          return await callGrok(prompt);
        case 'openai':
          return await callGPT(prompt);
        // Add more providers as needed
      }
    } catch (error) {
      console.log(`${provider.name} API call failed, trying next provider...`);
      lastError = error;
    }
  }
  
  // If we get here, all providers failed
  console.error('All LLM API calls failed');
  throw new Error('ValidationServiceUnavailable: All LLM providers failed');
}
```

These approaches would make the system much more adaptable to changing requirements or provider availability without requiring code changes or rebuilds.