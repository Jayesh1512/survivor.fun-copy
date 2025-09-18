import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { NarratorPrompt } from "@/lib/prompts";
import { SURVIVE_SCORE_THRESHOLD, MIN_STEPS_THRESHOLD } from "@/lib/constants";
import type { AgentResponse } from "@/types/api";
import { z } from "zod";

export const runtime = "nodejs";

type NarratorRequest = {
    scenario: string;
    finalDecision: string;
    agentName: string;
    chatHistory?: unknown[];
    persuasion?: { score: number; steps_count: number };
};

export async function POST(
    req: Request & { json: () => Promise<NarratorRequest> },
): Promise<NextResponse<AgentResponse>> {
    try {
        const { scenario, finalDecision, agentName, chatHistory = [], persuasion } = await req.json();
        const isDev = process.env.NODE_ENV !== "production";
        if (!scenario || !finalDecision || !agentName) {
            return NextResponse.json({ error: "Missing required fields: scenario, finalDecision, agentName" }, { status: 400 });
        }

        isDev && console.log("[narrator] request", { scenario, finalDecision, agentName, chatHistory, persuasion });

        const model = openai("gpt-4.1-mini");


        // 1) Decide expected outcome deterministically based on provided persuasion
        const providedPersuasion = persuasion && typeof persuasion.score === 'number' && typeof persuasion.steps_count === 'number'
            ? persuasion
            : { score: 0, steps_count: 0 };

        const expectedOutcome: "survived" | "died" =
            providedPersuasion.score >= SURVIVE_SCORE_THRESHOLD && providedPersuasion.steps_count >= MIN_STEPS_THRESHOLD
                ? "survived"
                : "died";

        if (isDev) {
            console.log("[narrator] persuasion", providedPersuasion);
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

        return NextResponse.json({ response: JSON.stringify(narration) });
    } catch (error) {
        console.error("Error processing narration request:", error);
        return NextResponse.json({ error: "Failed to generate narration" }, { status: 500 });
    }
}
