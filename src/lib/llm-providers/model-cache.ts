import { CachedModels, LLMModel } from './types';

class ModelCacheManager {
    private static instance: ModelCacheManager;
    private cache: Map<string, CachedModels> = new Map();

    private constructor() {}

    static getInstance(): ModelCacheManager {
        if (!ModelCacheManager.instance) {
            ModelCacheManager.instance = new ModelCacheManager();
        }
        return ModelCacheManager.instance;
    }

    get(key: string): LLMModel[] | null {
        const cached = this.cache.get(key);
        if (!cached) return null;

        const now = Date.now();
        const age = (now - cached.timestamp) / 1000; // age in seconds

        if (age > cached.ttl) {
            // Cache expired
            this.cache.delete(key);
            return null;
        }

        return cached.models;
    }

    set(key: string, models: LLMModel[], ttl: number): void {
        this.cache.set(key, {
            models,
            timestamp: Date.now(),
            ttl
        });
    }

    clear(key?: string): void {
        if (key) {
            this.cache.delete(key);
        } else {
            this.cache.clear();
        }
    }

    // Get cache stats for monitoring
    getStats(): { size: number; keys: string[] } {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

export const modelCache = ModelCacheManager.getInstance();