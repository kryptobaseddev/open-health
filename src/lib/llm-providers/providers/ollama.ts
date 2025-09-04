import { ModelProvider, LLMModel, ProviderConfig } from '../types';

export class OllamaModelProvider implements ModelProvider {
    private config: ProviderConfig;
    supportsDynamicListing = true;

    constructor(config: ProviderConfig) {
        this.config = config;
    }

    async getModels(): Promise<LLMModel[]> {
        if (!this.config.apiURL) {
            return this.getFallbackModels();
        }

        try {
            const response = await fetch(`${this.config.apiURL}/api/tags`);
            
            if (!response.ok) {
                console.error('Failed to fetch Ollama models:', response.status);
                return this.getFallbackModels();
            }
            
            const { models } = await response.json();
            
            if (!models || !Array.isArray(models)) {
                return this.getFallbackModels();
            }

            return models.map(({ model, name, size, details }: {
                model: string;
                name: string;
                size?: number;
                details?: {
                    parameter_size?: string;
                    quantization_level?: string;
                };
            }) => ({
                id: model,
                name: this.formatModelName(name || model, details),
                capabilities: this.getModelCapabilities(model)
            }))
            .sort((a, b) => {
                // Sort popular models to top
                const priority = ['llama3', 'llama2', 'mistral', 'mixtral', 'deepseek', 'qwen', 'gemma', 'phi'];
                const aIndex = priority.findIndex(p => a.id.toLowerCase().includes(p));
                const bIndex = priority.findIndex(p => b.id.toLowerCase().includes(p));
                
                if (aIndex !== -1 && bIndex !== -1) {
                    return aIndex - bIndex;
                }
                if (aIndex !== -1) return -1;
                if (bIndex !== -1) return 1;
                
                return a.name.localeCompare(b.name);
            });
        } catch (error) {
            console.error('Failed to fetch Ollama models dynamically:', error);
            return this.getFallbackModels();
        }
    }

    getFallbackModels(): LLMModel[] {
        // Common Ollama models as fallback
        return [
            {
                id: 'llama3.3:latest',
                name: 'Llama 3.3 (Latest)',
                capabilities: {
                    vision: false,
                    functionCalling: true,
                    maxTokens: 128000
                }
            },
            {
                id: 'llama3.2:latest',
                name: 'Llama 3.2 (Latest)',
                capabilities: {
                    vision: false,
                    functionCalling: true,
                    maxTokens: 128000
                }
            },
            {
                id: 'llama3.2-vision:latest',
                name: 'Llama 3.2 Vision',
                capabilities: {
                    vision: true,
                    functionCalling: true,
                    maxTokens: 128000
                }
            },
            {
                id: 'mistral:latest',
                name: 'Mistral (Latest)',
                capabilities: {
                    vision: false,
                    functionCalling: true,
                    maxTokens: 32768
                }
            },
            {
                id: 'mixtral:latest',
                name: 'Mixtral (Latest)',
                capabilities: {
                    vision: false,
                    functionCalling: true,
                    maxTokens: 32768
                }
            },
            {
                id: 'deepseek-coder-v2:latest',
                name: 'DeepSeek Coder V2',
                capabilities: {
                    vision: false,
                    functionCalling: true,
                    maxTokens: 128000
                }
            },
            {
                id: 'qwen2.5:latest',
                name: 'Qwen 2.5 (Latest)',
                capabilities: {
                    vision: false,
                    functionCalling: true,
                    maxTokens: 32768
                }
            },
            {
                id: 'gemma2:latest',
                name: 'Gemma 2 (Latest)',
                capabilities: {
                    vision: false,
                    functionCalling: false,
                    maxTokens: 8192
                }
            }
        ];
    }

    private formatModelName(name: string, details?: any): string {
        // Clean up the model name
        let formatted = name;
        
        // Add parameter size if available
        if (details?.parameter_size) {
            const size = details.parameter_size.toUpperCase();
            if (!formatted.includes(size)) {
                formatted = `${formatted} (${size})`;
            }
        }
        
        // Add quantization if it's not the default
        if (details?.quantization_level && details.quantization_level !== 'Q4_0') {
            formatted = `${formatted} [${details.quantization_level}]`;
        }
        
        // Capitalize known model names
        const knownModels: Record<string, string> = {
            'llama': 'Llama',
            'mistral': 'Mistral',
            'mixtral': 'Mixtral',
            'deepseek': 'DeepSeek',
            'qwen': 'Qwen',
            'gemma': 'Gemma',
            'phi': 'Phi',
            'vicuna': 'Vicuna',
            'alpaca': 'Alpaca',
            'codellama': 'CodeLlama'
        };
        
        for (const [key, value] of Object.entries(knownModels)) {
            if (formatted.toLowerCase().includes(key)) {
                formatted = formatted.replace(new RegExp(key, 'gi'), value);
                break;
            }
        }
        
        return formatted;
    }

    private getModelCapabilities(modelId: string): LLMModel['capabilities'] {
        const lower = modelId.toLowerCase();
        
        // Check for vision models
        const hasVision = lower.includes('vision') || 
                         lower.includes('llava') || 
                         lower.includes('bakllava');
        
        // Most modern models support function calling
        const hasFunctionCalling = !lower.includes('gemma') && 
                                  !lower.includes('phi-2');
        
        // Estimate max tokens based on model
        let maxTokens = 4096; // Conservative default
        
        if (lower.includes('llama3') || lower.includes('llama-3')) {
            maxTokens = 128000;
        } else if (lower.includes('deepseek')) {
            maxTokens = 128000;
        } else if (lower.includes('mixtral') || lower.includes('mistral')) {
            maxTokens = 32768;
        } else if (lower.includes('qwen')) {
            maxTokens = 32768;
        } else if (lower.includes('gemma2')) {
            maxTokens = 8192;
        } else if (lower.includes('llama2') || lower.includes('llama-2')) {
            maxTokens = 4096;
        }
        
        return {
            vision: hasVision,
            functionCalling: hasFunctionCalling,
            maxTokens
        };
    }

    getCacheKey(): string {
        return `ollama_${this.config.apiURL || 'localhost'}`;
    }

    getCacheTTL(): number {
        return 300; // 5 minutes - Ollama models can change frequently
    }
}