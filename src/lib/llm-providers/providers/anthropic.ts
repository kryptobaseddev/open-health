import { ModelProvider, LLMModel, ProviderConfig } from '../types';

export class AnthropicModelProvider implements ModelProvider {
    private config: ProviderConfig;
    supportsDynamicListing = false; // Anthropic doesn't provide model listing API

    constructor(config: ProviderConfig) {
        this.config = config;
    }

    async getModels(): Promise<LLMModel[]> {
        // Anthropic doesn't have a model listing API, so we always use the fallback
        return this.getFallbackModels();
    }

    getFallbackModels(): LLMModel[] {
        // Updated model list as of January 2025
        const allModels: LLMModel[] = [
            // Claude 4 Models
            {
                id: 'claude-opus-4-20250514',
                name: 'Claude 4 Opus',
                capabilities: {
                    vision: true,
                    functionCalling: true,
                    maxTokens: 200000
                }
            },
            {
                id: 'claude-sonnet-4-20250514',
                name: 'Claude 4 Sonnet',
                capabilities: {
                    vision: true,
                    functionCalling: true,
                    maxTokens: 200000
                }
            },
            
            // Claude 3.7 Models
            {
                id: 'claude-3-7-sonnet-20250219',
                name: 'Claude 3.7 Sonnet',
                capabilities: {
                    vision: true,
                    functionCalling: true,
                    maxTokens: 200000
                }
            },
            
            // Claude 3.5 Models
            {
                id: 'claude-3-5-sonnet-20241022',
                name: 'Claude 3.5 Sonnet',
                capabilities: {
                    vision: true,
                    functionCalling: true,
                    maxTokens: 200000
                }
            },
            {
                id: 'claude-3-5-haiku-20241022',
                name: 'Claude 3.5 Haiku',
                capabilities: {
                    vision: true,
                    functionCalling: true,
                    maxTokens: 200000
                }
            },
            
            // Claude 3 Models
            {
                id: 'claude-3-opus-20240229',
                name: 'Claude 3 Opus',
                capabilities: {
                    vision: true,
                    functionCalling: true,
                    maxTokens: 200000
                }
            },
            {
                id: 'claude-3-sonnet-20240229',
                name: 'Claude 3 Sonnet',
                capabilities: {
                    vision: true,
                    functionCalling: true,
                    maxTokens: 200000
                }
            },
            {
                id: 'claude-3-haiku-20240307',
                name: 'Claude 3 Haiku',
                capabilities: {
                    vision: true,
                    functionCalling: true,
                    maxTokens: 200000
                }
            },
            
            // Legacy models for compatibility
            {
                id: 'claude-2.1',
                name: 'Claude 2.1',
                deprecated: true,
                deprecationNotice: 'Legacy model - consider upgrading to Claude 3 or newer',
                capabilities: {
                    vision: false,
                    functionCalling: false,
                    maxTokens: 200000
                }
            },
            {
                id: 'claude-2.0',
                name: 'Claude 2.0',
                deprecated: true,
                deprecationNotice: 'Legacy model - consider upgrading to Claude 3 or newer',
                capabilities: {
                    vision: false,
                    functionCalling: false,
                    maxTokens: 100000
                }
            },
            {
                id: 'claude-instant-1.2',
                name: 'Claude Instant 1.2',
                deprecated: true,
                deprecationNotice: 'Legacy model - consider using Claude 3 Haiku for similar speed',
                capabilities: {
                    vision: false,
                    functionCalling: false,
                    maxTokens: 100000
                }
            }
        ];

        // Filter models based on deployment environment
        if (this.config.deploymentEnv === 'cloud') {
            return allModels.filter((model) => {
                // In cloud, show Claude 4, 3.7, and 3.5 models, plus Claude 3 Opus
                return model.id.startsWith('claude-opus-4') || 
                       model.id.startsWith('claude-sonnet-4') ||
                       model.id.startsWith('claude-3-7') ||
                       model.id.startsWith('claude-3-5') || 
                       model.id.startsWith('claude-3-opus');
            });
        }
        
        // In local, show all models
        return allModels;
    }

    getCacheKey(): string {
        return `anthropic_${this.config.deploymentEnv || 'local'}`;
    }

    getCacheTTL(): number {
        return 86400; // 24 hours - since models are hardcoded, cache for longer
    }
}