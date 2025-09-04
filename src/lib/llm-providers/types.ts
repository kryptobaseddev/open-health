export interface LLMModel {
    id: string;
    name: string;
    capabilities?: {
        vision?: boolean;
        functionCalling?: boolean;
        maxTokens?: number;
    };
    deprecated?: boolean;
    deprecationNotice?: string;
}

export interface ModelProvider {
    getModels(): Promise<LLMModel[]>;
    supportsDynamicListing: boolean;
    getFallbackModels(): LLMModel[];
    getCacheKey(): string;
    getCacheTTL(): number; // TTL in seconds
}

export interface CachedModels {
    models: LLMModel[];
    timestamp: number;
    ttl: number;
}

export type ProviderId = 'openai' | 'anthropic' | 'google' | 'ollama';

export interface ProviderConfig {
    id: ProviderId;
    apiKey?: string;
    apiURL?: string;
    deploymentEnv?: 'local' | 'cloud';
}