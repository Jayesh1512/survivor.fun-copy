import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getVercelAITools } from "@coinbase/agentkit-vercel-ai-sdk";
import { prepareAgentkitAndWalletProvider } from "@/lib/prepare-agentkit";
import { AnalyserPrompt } from "@/lib/prompts";
import type { AgentResponse } from "@/types/api";
import { createCorsResponse, handleOptions } from "@/lib/cors";

type AnalyseRequest = {
    scenario: string;
    agentName: string;
    chatHistory?: unknown[];
};

// Handle CORS preflight requests
export async function OPTIONS() {
    return handleOptions();
}

export async function POST(
    req: Request & { json: () => Promise<AnalyseRequest> },
): Promise<NextResponse<AgentResponse>> {
    try {
        const { scenario, agentName, chatHistory = [] } = await req.json();

        if (!scenario || !agentName) {
            return createCorsResponse(
                { error: "Missing required fields: scenario, agentName" },
                { status: 400 },
            );
        }

        const model = openai("gpt-4.1-mini");
        const { agentkit } = await prepareAgentkitAndWalletProvider();
        const tools = getVercelAITools(agentkit);
        const maxSteps = 10;

        const system = AnalyserPrompt(scenario, agentName, chatHistory);

        const { text } = await generateText({
            model,
            tools,
            maxSteps,
            system,
            messages: [
                {
                    role: "user",
                    content: "Return the final decision as one plain sentence now.",
                },
            ],
        });

        return createCorsResponse({ response: text.trim() });
    } catch (error) {
        console.error("Error processing analyse request:", error);
        return createCorsResponse({ error: "Failed to analyse conversation" }, { status: 500 });
    }
}

// Sanitizer removed; prompt enforces plain text output.


