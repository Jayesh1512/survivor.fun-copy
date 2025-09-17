import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { NarratorPrompt, PersuasionPrompt } from "@/lib/prompts";
import { SURVIVE_SCORE_THRESHOLD, MIN_STEPS_THRESHOLD } from "@/lib/constants";
import type { AgentResponse } from "@/types/api";
import { createCorsResponse, handleOptions } from "@/lib/cors";
import { z } from "zod";

export const runtime = "nodejs";

type NarratorRequest = {
    scenario: string;
    finalDecision: string;
    agentName: string;
    chatHistory?: unknown[];
};

// Handle CORS preflight requests
export async function OPTIONS(req: Request) {
    return handleOptions(req);
}

export async function POST(
    req: Request & { json: () => Promise<NarratorRequest> },
): Promise<NextResponse<AgentResponse>> {
    try {
        const { scenario, finalDecision, agentName, chatHistory = [] } = await req.json();

        if (!scenario || !finalDecision || !agentName) {
            return createCorsResponse(
                { error: "Missing required fields: scenario, finalDecision, agentName" },
                { status: 400 },
            );
        }

        const model = openai("gpt-4.1-mini");

        // 1) Compute persuasion internally (hidden from client)
        const persuasionSchema = z.object({
            score: z.number().min(0).max(100),
            steps_count: z.number().int().min(0).default(0)
        });

        const isDev = process.env.NODE_ENV !== "production";

        const persuasionSystem = PersuasionPrompt(
            scenario,
            agentName,
            chatHistory as any,
        );


        const { object: persuasion } = await generateObject({
            model,
            system: persuasionSystem,
            schema: persuasionSchema,
            messages: [
                { role: "user", content: "Return only the JSON report as specified." },
            ],
        });

        // 2) Decide expected outcome deterministically based on persuasion
        const expectedOutcome: "survived" | "died" =
            persuasion.score >= SURVIVE_SCORE_THRESHOLD && persuasion.steps_count >= MIN_STEPS_THRESHOLD
                ? "survived"
                : "died";

        if (isDev) {
            console.log("[narrator] persuasion", {
                score: persuasion.score,
                steps_count: persuasion.steps_count,
            });
            console.log("[narrator] outcome_decision", {
                expectedOutcome,
                SURVIVE_SCORE_THRESHOLD,
                MIN_STEPS_THRESHOLD,
            });
        }

        // 3) Generate narration via JSON schema with forced expected outcome
        const narrationSchema = z.object({
            story: z.string(),
            result: z.enum(["survived", "died"]),
        });

        const narrationSystem = NarratorPrompt(scenario, finalDecision, chatHistory as any, expectedOutcome);


        const { object: narration } = await generateObject({
            model,
            system: narrationSystem,
            schema: narrationSchema,
            messages: [
                { role: "user", content: "Return only the JSON with story and result." },
            ],
        });

        if (isDev) {
            console.log("[narrator] narration_result", {
                result: narration.result,
                story_preview: typeof narration.story === "string" ? narration.story.slice(0, 120) : "",
            });
        }

        return createCorsResponse({ response: JSON.stringify(narration) });
    } catch (error) {
        console.error("Error processing narration request:", error);
        return createCorsResponse({ error: "Failed to generate narration" }, { status: 500 });
    }
}
