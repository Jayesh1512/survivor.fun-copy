import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getVercelAITools } from "@coinbase/agentkit-vercel-ai-sdk";
import { prepareAgentkitAndWalletProvider } from "@/lib/prepare-agentkit";
import { NarratorPrompt } from "@/lib/prompts";
import type { AgentResponse } from "@/types/api";

type NarratorRequest = {
    scenario: string;
    finalDecision: string;
    chatHistory?: unknown[];
};

export async function POST(
    req: Request & { json: () => Promise<NarratorRequest> },
): Promise<NextResponse<AgentResponse>> {
    try {
        const { scenario, finalDecision, chatHistory = [] } = await req.json();

        if (!scenario || !finalDecision) {
            return NextResponse.json(
                { error: "Missing required fields: scenario, finalDecision" },
                { status: 400 },
            );
        }

        const model = openai("gpt-4.1-mini");
        const { agentkit } = await prepareAgentkitAndWalletProvider();
        const tools = getVercelAITools(agentkit);
        const maxSteps = 10;

        const system = NarratorPrompt(scenario, finalDecision, chatHistory as any);

        const { text } = await generateText({
            model,
            tools,
            maxSteps,
            system,
            messages: [
                {
                    role: "user",
                    content:
                        "Write the narration now and return only the JSON with story and result.",
                },
            ],
        });

        return NextResponse.json({ response: text });
    } catch (error) {
        console.error("Error processing narration request:", error);
        return NextResponse.json({ error: "Failed to generate narration" }, { status: 500 });
    }
}


