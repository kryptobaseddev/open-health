import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import {decrypt} from "@/lib/encryption";
import {currentDeploymentEnv} from "@/lib/current-deployment-env";

export interface LLMProviderModel {
    id: string
    name: string
}

export interface LLMProviderModelListResponse {
    llmProviderModels: LLMProviderModel[]
}

export async function GET(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const {id} = await params
    const llmProvider = await prisma.lLMProvider.findUniqueOrThrow({
        where: {id}
    });
    let apiKey: string
    try {
        apiKey = decrypt(llmProvider.apiKey)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        apiKey = ''
    }

    if (llmProvider.providerId === 'openai') {
        if (currentDeploymentEnv === 'cloud') apiKey = process.env.OPENAI_API_KEY as string
        const results: LLMProviderModel[] = []
        const openAI = new OpenAI({apiKey, baseURL: llmProvider.apiURL})
        const modelsPage = await openAI.models.list()
        for await (const models of modelsPage.iterPages()) {
            const modelList = models.data;
            results.push(...modelList.filter((model) => {
                if (currentDeploymentEnv === 'cloud') {
                    return ['gpt-4o', 'o3-mini'].includes(model.id);
                }
                return !model.id.startsWith('ft:');
            }).map(model => ({id: model.id, name: model.id})))
        }
        return NextResponse.json<LLMProviderModelListResponse>({
            llmProviderModels: results,
        })
    } else if (llmProvider.providerId === 'anthropic') {
        if (currentDeploymentEnv === 'cloud') apiKey = process.env.ANTHROPIC_API_KEY as string
        
        // Anthropic models are not dynamically listed via API
        // Using hardcoded list of current models (as of January 2025)
        const anthropicModels = [
            // Claude 4 Models
            { id: 'claude-opus-4-20250514', name: 'Claude 4 Opus' },
            { id: 'claude-sonnet-4-20250514', name: 'Claude 4 Sonnet' },
            
            // Claude 3.7 Models
            { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet' },
            
            // Claude 3.5 Models
            { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
            { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
            
            // Claude 3 Models
            { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
            { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
            { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
            
            // Legacy models for compatibility
            { id: 'claude-2.1', name: 'Claude 2.1 (Legacy)' },
            { id: 'claude-2.0', name: 'Claude 2.0 (Legacy)' },
            { id: 'claude-instant-1.2', name: 'Claude Instant 1.2 (Legacy)' }
        ];
        
        // Filter models based on deployment environment
        const filteredModels = anthropicModels.filter((model) => {
            if (currentDeploymentEnv === 'cloud') {
                // In cloud, show Claude 4, 3.7, and 3.5 models
                return model.id.startsWith('claude-opus-4') || 
                       model.id.startsWith('claude-sonnet-4') ||
                       model.id.startsWith('claude-3-7') ||
                       model.id.startsWith('claude-3-5') || 
                       model.id.startsWith('claude-3-opus');
            }
            // In local, show all models
            return true;
        });
        
        return NextResponse.json<LLMProviderModelListResponse>({
            llmProviderModels: filteredModels,
        })
    } else if (llmProvider.providerId === 'google') {
        if (currentDeploymentEnv === 'cloud') apiKey = process.env.GOOGLE_API_KEY as string
        const url = new URL('https://generativelanguage.googleapis.com/v1beta/models');
        url.searchParams.append('key', apiKey);
        url.searchParams.append('pageSize', '1000');
        const response = await fetch(url.toString())
        const {models} = await response.json()
        return NextResponse.json<LLMProviderModelListResponse>({
            llmProviderModels: models.filter(({displayName}: { displayName: string }) => {
                if (currentDeploymentEnv === 'cloud') {
                    return displayName === 'Gemini 2.0 Flash';
                }
                return true;
            }).map(
                ({name, displayName}: { name: string, displayName: string }) => ({
                    id: name,
                    name: displayName
                })
            ),
        })
    } else if (llmProvider.providerId === 'ollama') {
        const apiURL = llmProvider.apiURL;
        const response = await fetch(`${apiURL}/api/tags`)
        const {models} = await response.json()
        return NextResponse.json<LLMProviderModelListResponse>({
            llmProviderModels: models.map(
                ({model, name}: { name: string, model: string }) => ({id: model, name})
            ),
        })
    }

    return NextResponse.json({error: 'Not implemented'}, {status: 403})
}
