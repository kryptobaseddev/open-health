import {NextRequest, NextResponse} from "next/server";
import prisma, {Prisma} from "@/lib/prisma";
import {auth} from "@/auth";
import {decrypt} from "@/lib/encryption";
import { withRateLimit, rateLimitConfigs } from "@/lib/rate-limit";
import {currentDeploymentEnv} from "@/lib/current-deployment-env";
import {ChatOpenAI} from "@langchain/openai";
import {ChatAnthropic} from "@langchain/anthropic";
import {ChatGoogleGenerativeAI} from "@langchain/google-genai";

export interface ChatMessage extends Prisma.ChatMessageGetPayload<{
    select: {
        id: true,
        content: true,
        createdAt: true,
        role: true
    }
}> {
    id: string,
}

export interface ChatMessageListResponse {
    chatMessages: ChatMessage[]
}

export interface ChatMessageCreateRequest {
    content: string,
    role: 'USER' | 'ASSISTANT',
    settings?: {
        company: string,
        model: string,
    }
}

export interface ChatMessageCreateResponse {
    chatMessage: ChatMessage
}

export async function GET(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    const user = session?.user
    if (!session || !user) return NextResponse.json({error: 'Unauthorized'}, {status: 401})

    const {id} = await params
    const chatMessages = await prisma.chatMessage.findMany({where: {chatRoomId: id}, orderBy: {createdAt: 'asc'}})
    return NextResponse.json<ChatMessageListResponse>({chatMessages})
}

export async function POST(
    req: NextRequest,
    {params}: {
        params: Promise<{ id: string }>,
    }
) {
    return withRateLimit(req, async () => {
        const session = await auth()
        const user = session?.user
        if (!session || !user) return NextResponse.json({error: 'Unauthorized'}, {status: 401})

        const {id} = await params
        const body: ChatMessageCreateRequest = await req.json()

        const {
            chatRoom,
            assistantMode,
            chatMessages,
            healthDataList,
            llmProvider
        } = await prisma.$transaction(async (prisma) => {
            await prisma.chatMessage.create({data: {content: body.content, role: body.role, chatRoomId: id}});
            const {assistantMode} = await prisma.chatRoom.update({
                where: {id},
                data: {lastActivityAt: new Date()},
                select: {assistantMode: {select: {systemPrompt: true}}}
            })
            const chatMessages = await prisma.chatMessage.findMany({
                where: {chatRoomId: id},
                orderBy: {createdAt: 'asc'}
            })
            const healthDataList = await prisma.healthData.findMany({where: {authorId: user.id}})
            const chatRoom = await prisma.chatRoom.findUniqueOrThrow({where: {id}})
            const llmProvider = await prisma.lLMProvider.findUniqueOrThrow({where: {id: chatRoom.llmProviderId}});
            return {
                chatRoom,
                chatMessages,
                assistantMode,
                healthDataList,
                llmProvider
            }
        })

        let apiKey: string = ''
        
        // Try to use stored API key first (if not empty)
        if (llmProvider.apiKey) {
            try {
                apiKey = decrypt(llmProvider.apiKey)
            } catch (e) {
                // If decryption fails, apiKey remains empty
                console.log('Failed to decrypt stored API key, will try env variables')
            }
        }
        
        // If no stored key, try environment variables
        if (!apiKey) {
            const envKey = llmProvider.providerId === 'openai' ? process.env.OPENAI_API_KEY :
                        llmProvider.providerId === 'anthropic' ? process.env.ANTHROPIC_API_KEY :
                        llmProvider.providerId === 'google' ? process.env.GOOGLE_API_KEY :
                        undefined;
            
            if (envKey) {
                apiKey = envKey;
            }
        }
        
        // If still no key available, return error
        if (!apiKey) {
            return NextResponse.json({
                error: `No API key available for ${llmProvider.providerId}. Please add your API key in Settings or set the appropriate environment variable.`
            }, {status: 400});
        }

        const responseStream = new ReadableStream({
            async start(controller) {
                try {
                    const messagesBuilt = chatMessages.map((message) => {
                        if (message.role == 'USER') return {role: 'user', content: message.content} as {
                            role: "user" | "system" | "assistant",
                            content: string
                        };
                        return {role: 'assistant', content: message.content} as {
                            role: "user" | "system" | "assistant",
                            content: string
                        };
                    })
                    const messages = [{
                        role: 'system',
                        content: assistantMode.systemPrompt
                    } as { role: "user" | "system" | "assistant", content: string }, ...messagesBuilt];
                    const deploymentEnv = currentDeploymentEnv
                    if (deploymentEnv == 'local') {
                        // HEALTH DATA
                        const formattedHealthDataList = healthDataList.map(healthData => {
                            // The data field contains the encrypted content
                            const dataStr = typeof healthData.data === 'string' ? healthData.data : JSON.stringify(healthData.data);
                            try {
                                const decryptedContent = decrypt(dataStr);
                                return `Health data type: ${healthData.type}, content: ${decryptedContent}`;
                            } catch (e) {
                                // If decryption fails, just use the data as is (might not be encrypted)
                                return `Health data type: ${healthData.type}, content: ${dataStr}`;
                            }
                        });
                        const healthDataListFormatted = formattedHealthDataList.join(', ');
                        const modifiedMessages = [...messages];
                        modifiedMessages[0] = {
                            role: 'system',
                            content: `${messages[0].content}. HEALTH DATA: ${healthDataListFormatted}`
                        };
                        messages.length = 0;
                        messages.push(...modifiedMessages);
                    }
                    let messageContent = '';

                    if (llmProvider.providerId == 'openai') {
                        const llmProviderModelId = chatRoom.llmProviderModelId;
                        if (!llmProviderModelId) throw new Error('No LLM model ID provided');
                        const openai = new ChatOpenAI({
                            apiKey,
                            openAIApiKey: apiKey,
                            model: llmProviderModelId,
                            streaming: true,
                        }).withConfig({metadata: {chatRoomId: id}, runName: 'chat'})

                        const chatStream = await openai.stream(messages)
                        for await (const part of chatStream) {
                            const deltaContent = part.content.toString()
                            if (deltaContent !== undefined) messageContent += deltaContent;
                            controller.enqueue(`${JSON.stringify({content: messageContent})}\n`);
                        }
                    } else if (llmProvider.providerId == 'ollama') {
                        const llmProviderModelId = chatRoom.llmProviderModelId;
                        if (!llmProviderModelId) throw new Error('No LLM model ID provided');
                        const openai = new ChatOpenAI({
                            apiKey: '1234',
                            openAIApiKey: '1234',
                            model: llmProviderModelId,
                            streaming: true,
                            configuration: {
                                baseURL: llmProvider.apiURL
                            }
                        }).withConfig({metadata: {chatRoomId: id}, runName: 'chat'})

                        const chatStream = await openai.stream(messages)
                        for await (const part of chatStream) {
                            const deltaContent = part.content.toString()
                            if (deltaContent !== undefined) messageContent += deltaContent;
                            controller.enqueue(`${JSON.stringify({content: messageContent})}\n`);
                        }
                    } else if (llmProvider.providerId == 'anthropic') {
                        const llmProviderModelId = chatRoom.llmProviderModelId;
                        if (!llmProviderModelId) throw new Error('No LLM model ID provided');
                        const anthropic = new ChatAnthropic({
                            apiKey,
                            anthropicApiUrl: llmProvider.apiURL,
                            model: llmProviderModelId,
                            maxTokens: 4096,
                        }).withConfig({metadata: {chatRoomId: id}, runName: 'chat'})

                        const chatStream = await anthropic.stream(messages)
                        for await (const part of chatStream) {
                            const deltaContent = part.content.toString()
                            if (deltaContent !== undefined) messageContent += deltaContent;
                            controller.enqueue(`${JSON.stringify({content: messageContent})}\n`);
                        }
                    } else if (llmProvider.providerId == 'google') {
                        const llmProviderModelId = chatRoom.llmProviderModelId;
                        if (!llmProviderModelId) throw new Error('No LLM model ID provided');
                        const gemini = new ChatGoogleGenerativeAI({
                            apiKey,
                            model: llmProviderModelId,
                            maxOutputTokens: 4096,
                        }).withConfig({metadata: {chatRoomId: id}, runName: 'chat'})

                        const chatStream = await gemini.stream(messages)
                        for await (const part of chatStream) {
                            const deltaContent = part.content.toString()
                            if (deltaContent !== undefined) messageContent += deltaContent;
                            controller.enqueue(`${JSON.stringify({content: messageContent})}\n`);
                        }
                    } else {
                        controller.enqueue(`${JSON.stringify({error: 'No LLM provider found'})}\n`);
                    }
                    await prisma.$transaction(async (prisma) => {
                        await prisma.chatMessage.create({
                            data: {content: messageContent, role: 'ASSISTANT', chatRoomId: id}
                        })
                        await prisma.chatRoom.update({
                            where: {id}, data: {lastActivityAt: new Date(), name: messageContent}
                        })
                    });
                } catch (error) {
                    console.error('Error in chat stream:', error);
                    controller.enqueue(`${JSON.stringify({error: 'Failed to get response from LLM'})}\n`);
                }

                controller.close();
            }
        });

        return new NextResponse(responseStream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        });
    }, rateLimitConfigs.chat);
}