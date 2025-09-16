import { NextResponse } from "next/server";
import { createCorsResponse, handleOptions } from "@/lib/cors";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/contracts/contractDetails";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

export const runtime = "nodejs";

type KillAgentRequest = {
    agentId: string | number | bigint;
};

// Handle CORS preflight requests
export async function OPTIONS(req: Request) {
    return handleOptions(req);
}

export async function POST(
    req: Request & { json: () => Promise<KillAgentRequest> },
): Promise<NextResponse<{ hash?: string; error?: string }>> {
    try {
        const { agentId } = await req.json();
        if (agentId === undefined || agentId === null) {
            return createCorsResponse(
                { error: "Missing required field: agentId" },
                { status: 400 },
            );
        }

        const privateKey = process.env.SPONSOR_WALLET_PRIVATE_KEY;
        if (!privateKey) {
            console.error("Missing SPONSOR_WALLET_PRIVATE_KEY");
            return createCorsResponse(
                { error: "Server not configured with SPONSOR_WALLET_PRIVATE_KEY" },
                { status: 500 },
            );
        }

        if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
            console.error("Invalid SPONSOR_WALLET_PRIVATE_KEY. Must be 0x-prefixed 32-byte hex.");
            return createCorsResponse(
                { error: "Invalid SPONSOR_WALLET_PRIVATE_KEY format. Use 0x-prefixed 64-hex." },
                { status: 500 },
            );
        }

        const account = privateKeyToAccount(privateKey as `0x${string}`);
        const walletClient = createWalletClient({
            account,
            chain: baseSepolia,
            transport: http(),
        });

        const hash = await walletClient.writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "killAgent",
            args: [BigInt(agentId as any)],
        });

        return createCorsResponse({ hash });
    } catch (error) {
        console.error("Failed to send killAgent transaction:", error);
        return createCorsResponse(
            { error: "Failed to send transaction" },
            { status: 500 },
        );
    }
}
