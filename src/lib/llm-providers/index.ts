import { ModelProviderFactory } from './provider-factory';
import { modelCache } from './model-cache';
import { LLMModel, ProviderId, ProviderConfig } from './types';

export * from './types';
export { modelCache } from './model-cache';
export { ModelProviderFactory } from './provider-factory';

export async function getModelsForProvider(
    providerId: ProviderId,
    config: ProviderConfig
): Promise<LLMModel[]> {
    const provider = ModelProviderFactory.createProvider(providerId, config);
    const cacheKey = provider.getCacheKey();
    
    // Check cache first
    const cachedModels = modelCache.get(cacheKey);
    if (cachedModels) {
        console.log(`Using cached models for ${providerId}`);
        return cachedModels;
    }
    
    // Fetch fresh models
    console.log(`Fetching fresh models for ${providerId}`);
    const models = await provider.getModels();
    
    // Cache the results
    modelCache.set(cacheKey, models, provider.getCacheTTL());
    
    return models;
}

// Utility function to clear cache for a specific provider or all
export function clearModelCache(providerId?: ProviderId, apiURL?: string): void {
    if (providerId) {
        const deploymentEnv = process.env.DEPLOYMENT_ENV || process.env.NEXT_PUBLIC_DEPLOYMENT_ENV || 'local';
        let cacheKey = `${providerId}_${deploymentEnv}`;
        if (apiURL) {
            cacheKey += `_${apiURL}`;
        }
        modelCache.clear(cacheKey);
        console.log(`Cleared cache for ${providerId}`);
    } else {
        modelCache.clear();
        console.log('Cleared all model caches');
    }
}

// Get cache statistics for monitoring
export function getCacheStats() {
    return modelCache.getStats();
}