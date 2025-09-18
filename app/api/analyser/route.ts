import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { CombinedAnalyserPrompt } from "@/lib/prompts";
import type { AgentResponse } from "@/types/api";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/contracts/contractDetails";
import { defaultChain } from "@/lib/constants";
import { z } from "zod";

export const runtime = "nodejs";

type AnalyseRequest = {
    scenario: string;
    agentName: string;
    chatHistory?: unknown[];
    agentId?: string | number | bigint;
};

export async function POST(
    req: Request & { json: () => Promise<AnalyseRequest> },
): Promise<NextResponse<AgentResponse>> {
    try {
        const { scenario, agentName, chatHistory = [], agentId } = await req.json();

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

        // Determine expected outcome
        const { decision, persuasion } = object as { decision: string; persuasion: { score: number; steps_count: number } };
        // We don't import thresholds here; narrator enforces final fate. On-chain actions will follow the same thresholds there.
        // To keep a single place, we mirror thresholds here to decide chain call deterministically.
        const { SURVIVE_SCORE_THRESHOLD, MIN_STEPS_THRESHOLD } = await import("@/lib/constants");
        const expectedOutcome: "survived" | "died" =
            persuasion.score >= SURVIVE_SCORE_THRESHOLD && persuasion.steps_count >= MIN_STEPS_THRESHOLD ? "survived" : "died";

        // Optional on-chain call if agentId provided and sponsor key available
        let txHash: `0x${string}` | undefined;
        if (agentId !== undefined && agentId !== null) {
            const pk = process.env.SPONSOR_WALLET_PRIVATE_KEY;
            if (pk && /^0x[0-9a-fA-F]{64}$/.test(pk)) {
                try {
                    const account = privateKeyToAccount(pk as `0x${string}`);
                    const walletClient = createWalletClient({
                        account,
                        chain: defaultChain,
                        transport: http(),
                    });
                    const fn = expectedOutcome === "died" ? "killAgent" : "surviveAgent";
                    const id = BigInt(agentId as any);
                    console.log(`[analyser] on-chain ${fn} start`, { agentId: id.toString(), expectedOutcome });
                    txHash = await walletClient.writeContract({
                        address: CONTRACT_ADDRESS,
                        abi: CONTRACT_ABI,
                        functionName: fn,
                        args: [id],
                    });
                    console.log(`[analyser] on-chain ${fn} success`, { agentId: id.toString(), txHash });
                } catch (e) {
                    console.error(`[analyser] on-chain ${expectedOutcome === "died" ? "killAgent" : "surviveAgent"} failed`, e);
                }
            } else {
                if (!pk) console.error("[analyser] Missing SPONSOR_WALLET_PRIVATE_KEY");
                else console.error("[analyser] Invalid SPONSOR_WALLET_PRIVATE_KEY format");
            }
        } else {
            console.warn("[analyser] agentId not provided; skipping on-chain action", { expectedOutcome });
        }

        return NextResponse.json({ response: JSON.stringify({ decision, persuasion, expectedOutcome, txHash }) });
    } catch (error) {
        console.error("Error processing analyse request:", error);
        return NextResponse.json({ error: "Failed to analyse conversation" }, { status: 500 });
    }
}
