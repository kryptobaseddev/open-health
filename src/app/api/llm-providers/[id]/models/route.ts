import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {decrypt} from "@/lib/encryption";
import {currentDeploymentEnv} from "@/lib/current-deployment-env";
import { getModelsForProvider, ProviderId, LLMModel } from "@/lib/llm-providers";

export interface LLMProviderModel {
    id: string
    name: string
    capabilities?: {
        vision?: boolean
        functionCalling?: boolean
        maxTokens?: number
    }
    deprecated?: boolean
    deprecationNotice?: string
}

export interface LLMProviderModelListResponse {
    llmProviderModels: LLMProviderModel[]
}

export async function GET(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const {id} = await params
        const llmProvider = await prisma.lLMProvider.findUniqueOrThrow({
            where: {id}
        });
        
        let apiKey: string = ''
        
        // Try to use stored API key first (if not empty)
        if (llmProvider.apiKey) {
            try {
                apiKey = decrypt(llmProvider.apiKey)
            } catch (e) {
                // If decryption fails, apiKey remains empty
                console.log('Failed to decrypt stored API key, falling back to env vars');
                apiKey = ''
            }
        }
        
        // If no stored key, use environment variables as fallback
        if (!apiKey) {
            switch (llmProvider.providerId) {
                case 'openai':
                    apiKey = process.env.OPENAI_API_KEY || ''
                    break;
                case 'anthropic':
                    apiKey = process.env.ANTHROPIC_API_KEY || ''
                    break;
                case 'google':
                    apiKey = process.env.GOOGLE_API_KEY || ''
                    break;
                case 'ollama':
                    // Ollama doesn't need an API key
                    apiKey = ''
                    break;
            }
        }

        // Use the new provider abstraction
        const models = await getModelsForProvider(
            llmProvider.providerId as ProviderId,
            {
                id: llmProvider.providerId as ProviderId,
                apiKey,
                apiURL: llmProvider.apiURL || undefined,
                deploymentEnv: currentDeploymentEnv
            }
        );

        // Convert LLMModel to LLMProviderModel format for backward compatibility
        const providerModels: LLMProviderModel[] = models.map(model => ({
            id: model.id,
            name: model.deprecated ? `${model.name} (Deprecated)` : model.name
        }));

        return NextResponse.json<LLMProviderModelListResponse>({
            llmProviderModels: providerModels,
        });
    } catch (error) {
        console.error('Error fetching models:', error);
        return NextResponse.json(
            { error: 'Failed to fetch models', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
