import OpenAI from 'openai';
import { ModelProvider, LLMModel, ProviderConfig } from '../types';

export class OpenAIModelProvider implements ModelProvider {
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
            const openai = new OpenAI({
                apiKey: this.config.apiKey,
                baseURL: this.config.apiURL
            });

            const results: LLMModel[] = [];
            const modelsPage = await openai.models.list();
            
            for await (const models of modelsPage.iterPages()) {
                const modelList = models.data;
                results.push(...modelList
                    .filter((model) => {
                        // Filter out fine-tuned models
                        if (model.id.startsWith('ft:')) return false;
                        
                        // In cloud env, only show specific models
                        if (this.config.deploymentEnv === 'cloud') {
                            return ['gpt-4o', 'o3-mini', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4'].some(m => model.id.includes(m));
                        }
                        return true;
                    })
                    .map(model => ({
                        id: model.id,
                        name: this.formatModelName(model.id),
                        capabilities: this.getModelCapabilities(model.id)
                    }))
                );
            }
            
            return results.sort((a, b) => {
                // Sort with newest models first
                const order = ['o3', 'gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5'];
                const aIndex = order.findIndex(o => a.id.includes(o));
                const bIndex = order.findIndex(o => b.id.includes(o));
                if (aIndex === -1) return 1;
                if (bIndex === -1) return -1;
                return aIndex - bIndex;
            });
        } catch (error) {
            console.error('Failed to fetch OpenAI models dynamically:', error);
            return this.getFallbackModels();
        }
    }

    getFallbackModels(): LLMModel[] {
        // Fallback models if API fails
        const models = [
            { id: 'o3-mini', name: 'O3 Mini' },
            { id: 'gpt-4o', name: 'GPT-4o' },
            { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
            { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
            { id: 'gpt-4', name: 'GPT-4' },
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
        ];

        if (this.config.deploymentEnv === 'cloud') {
            return models.slice(0, 4); // Only newest models in cloud
        }
        
        return models.map(m => ({
            ...m,
            capabilities: this.getModelCapabilities(m.id)
        }));
    }

    private formatModelName(modelId: string): string {
        // Beautify model names
        const nameMap: Record<string, string> = {
            'o3-mini': 'O3 Mini',
            'gpt-4o': 'GPT-4o',
            'gpt-4o-mini': 'GPT-4o Mini',
            'gpt-4-turbo': 'GPT-4 Turbo',
            'gpt-4': 'GPT-4',
            'gpt-3.5-turbo': 'GPT-3.5 Turbo',
        };
        
        for (const [key, value] of Object.entries(nameMap)) {
            if (modelId.includes(key)) {
                const datePattern = /-(\d{4})(\d{2})(\d{2})$/;
                const match = modelId.match(datePattern);
                if (match) {
                    return `${value} (${match[1]}-${match[2]}-${match[3]})`;
                }
                return value;
            }
        }
        
        return modelId;
    }

    private getModelCapabilities(modelId: string): LLMModel['capabilities'] {
        const hasVision = modelId.includes('vision') || modelId.includes('gpt-4o');
        const hasFunctionCalling = !modelId.includes('base');
        
        let maxTokens = 4096;
        if (modelId.includes('gpt-4o') || modelId.includes('o3')) {
            maxTokens = 128000;
        } else if (modelId.includes('gpt-4-turbo')) {
            maxTokens = 128000;
        } else if (modelId.includes('gpt-4-32k')) {
            maxTokens = 32768;
        } else if (modelId.includes('gpt-4')) {
            maxTokens = 8192;
        } else if (modelId.includes('gpt-3.5-turbo-16k')) {
            maxTokens = 16384;
        }
        
        return {
            vision: hasVision,
            functionCalling: hasFunctionCalling,
            maxTokens
        };
    }

    getCacheKey(): string {
        return `openai_${this.config.deploymentEnv || 'local'}_${this.config.apiURL || 'default'}`;
    }

    getCacheTTL(): number {
        return 3600; // 1 hour
    }
}