import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { CombinedAnalyserPrompt } from "@/lib/prompts";
import type { AgentResponse } from "@/types/api";
import { z } from "zod";

export const runtime = "nodejs";

type AnalyseRequest = {
    scenario: string;
    agentName: string;
    chatHistory?: unknown[];
};

export async function POST(
    req: Request & { json: () => Promise<AnalyseRequest> },
): Promise<NextResponse<AgentResponse>> {
    try {
        const { scenario, agentName, chatHistory = [] } = await req.json();

        if (!scenario || !agentName) {
            return NextResponse.json({ error: "Missing required fields: scenario, agentName" }, { status: 400 });
        }

        const model = openai("gpt-4.1");

        const schema = z.object({
            decision: z.string(),
            persuasion: z.object({
                score: z.number().min(0).max(100),
                steps_count: z.number().int().min(0).default(0),
            })
        });

        const system = CombinedAnalyserPrompt(scenario, agentName, chatHistory);

        const { object } = await generateObject({
            model,
            system,
            schema,
            messages: [
                { role: "user", content: "Return the combined decision and persuasion JSON now." },
            ],
        });

        return NextResponse.json({ response: JSON.stringify(object) });
    } catch (error) {
        console.error("Error processing analyse request:", error);
        return NextResponse.json({ error: "Failed to analyse conversation" }, { status: 500 });
    }
}
