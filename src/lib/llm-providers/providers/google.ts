import { ModelProvider, LLMModel, ProviderConfig } from '../types';

export class GoogleModelProvider implements ModelProvider {
    private config: ProviderConfig;
    supportsDynamicListing = true;

    constructor(config: ProviderConfig) {
        this.config = config;
    }

    async getModels(): Promise<LLMModel[]> {
        if (!this.config.apiKey) {
            return this.getFallbackModels();
        }

        try {
            const url = new URL('https://generativelanguage.googleapis.com/v1beta/models');
            url.searchParams.append('key', this.config.apiKey);
            url.searchParams.append('pageSize', '1000');
            
            const response = await fetch(url.toString());
            
            if (!response.ok) {
                console.error('Failed to fetch Google models:', response.status);
                return this.getFallbackModels();
            }
            
            const { models } = await response.json();
            
            if (!models || !Array.isArray(models)) {
                return this.getFallbackModels();
            }

            return models
                .filter(({ displayName }: { displayName: string }) => {
                    if (this.config.deploymentEnv === 'cloud') {
                        // In cloud, show only specific models
                        return ['Gemini 2.0 Flash', 'Gemini 1.5 Pro', 'Gemini 1.5 Flash'].includes(displayName);
                    }
                    return true;
                })
                .map(({ name, displayName, supportedGenerationMethods }: {
                    name: string;
                    displayName: string;
                    supportedGenerationMethods?: string[];
                }) => ({
                    id: name,
                    name: displayName,
                    capabilities: this.getModelCapabilities(displayName, supportedGenerationMethods)
                }))
                .sort((a, b) => {
                    // Sort with newest models first
                    const order = ['2.0', '1.5 Pro', '1.5 Flash', '1.0'];
                    const aIndex = order.findIndex(o => a.name.includes(o));
                    const bIndex = order.findIndex(o => b.name.includes(o));
                    if (aIndex === -1) return 1;
                    if (bIndex === -1) return -1;
                    return aIndex - bIndex;
                });
        } catch (error) {
            console.error('Failed to fetch Google models dynamically:', error);
            return this.getFallbackModels();
        }
    }

    getFallbackModels(): LLMModel[] {
        const models = [
            {
                id: 'models/gemini-2.0-flash-exp',
                name: 'Gemini 2.0 Flash',
                capabilities: {
                    vision: true,
                    functionCalling: true,
                    maxTokens: 1048576
                }
            },
            {
                id: 'models/gemini-1.5-pro-latest',
                name: 'Gemini 1.5 Pro',
                capabilities: {
                    vision: true,
                    functionCalling: true,
                    maxTokens: 2097152
                }
            },
            {
                id: 'models/gemini-1.5-flash-latest',
                name: 'Gemini 1.5 Flash',
                capabilities: {
                    vision: true,
                    functionCalling: true,
                    maxTokens: 1048576
                }
            },
            {
                id: 'models/gemini-pro',
                name: 'Gemini 1.0 Pro',
                capabilities: {
                    vision: false,
                    functionCalling: true,
                    maxTokens: 32768
                }
            }
        ];

        if (this.config.deploymentEnv === 'cloud') {
            return models.slice(0, 3); // Only newest models in cloud
        }
        
        return models;
    }

    private getModelCapabilities(
        displayName: string,
        supportedMethods?: string[]
    ): LLMModel['capabilities'] {
        const hasVision = displayName.includes('Vision') || 
                         displayName.includes('1.5') || 
                         displayName.includes('2.0');
        const hasFunctionCalling = !supportedMethods || 
                                  supportedMethods.includes('generateContent');
        
        let maxTokens = 32768; // Default
        if (displayName.includes('1.5 Pro')) {
            maxTokens = 2097152; // 2M tokens
        } else if (displayName.includes('1.5 Flash') || displayName.includes('2.0')) {
            maxTokens = 1048576; // 1M tokens
        }
        
        return {
            vision: hasVision,
            functionCalling: hasFunctionCalling,
            maxTokens
        };
    }

    getCacheKey(): string {
        return `google_${this.config.deploymentEnv || 'local'}`;
    }

    getCacheTTL(): number {
        return 3600; // 1 hour
    }
}