import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getVercelAITools } from "@coinbase/agentkit-vercel-ai-sdk";
import { prepareAgentkitAndWalletProvider } from "@/lib/prepare-agentkit";
import { ChatPrompt } from "@/lib/prompts";
import type { AgentResponse } from "@/types/api";

type ChatRequest = {
    scenario: string;
    nft: unknown; // structured NFT details object
    chatHistory?: unknown[];
    userResponse: string;
};

export async function POST(
    req: Request & { json: () => Promise<ChatRequest> },
): Promise<NextResponse<AgentResponse>> {
    try {
        const { scenario, nft: nftDetails, chatHistory = [], userResponse } = await req.json();

        if (!scenario || !nftDetails || !userResponse) {
            return NextResponse.json(
                { error: "Missing required fields: scenario, nft, userResponse" },
                { status: 400 },
            );
        }

        const model = openai("gpt-4.1-mini");
        const { agentkit } = await prepareAgentkitAndWalletProvider();
        const tools = getVercelAITools(agentkit);
        const maxSteps = 10;

        const system = ChatPrompt(scenario, nftDetails as any, chatHistory as any);

        const { text } = await generateText({
            model,
            tools,
            maxSteps,
            system,
            messages: [{ role: "user", content: userResponse }],
        });

        const response = sanitizePlainText(text);
        return NextResponse.json({ response });
    } catch (error) {
        console.error("Error processing chat request:", error);
        return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 });
    }
}

function sanitizePlainText(input: string): string {
    // Strip any XML/HTML-like tags and surrounding quotes
    const noTags = input.replace(/<[^>]+>/g, " ");
    const normalized = noTags.replace(/\s+/g, " ").trim();
    return normalized.replace(/^[\'\"“”‘’]+|[\'\"“”‘’]+$/g, "");
}
