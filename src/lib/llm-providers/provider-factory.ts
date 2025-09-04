import { ModelProvider, ProviderId, ProviderConfig } from './types';
import { OpenAIModelProvider } from './providers/openai';
import { AnthropicModelProvider } from './providers/anthropic';
import { GoogleModelProvider } from './providers/google';
import { OllamaModelProvider } from './providers/ollama';

export class ModelProviderFactory {
    static createProvider(providerId: ProviderId, config: ProviderConfig): ModelProvider {
        switch (providerId) {
            case 'openai':
                return new OpenAIModelProvider(config);
            case 'anthropic':
                return new AnthropicModelProvider(config);
            case 'google':
                return new GoogleModelProvider(config);
            case 'ollama':
                return new OllamaModelProvider(config);
            default:
                throw new Error(`Unknown provider: ${providerId}`);
        }
    }
}