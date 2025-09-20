import { NextResponse } from "next/server";
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/contracts/contractDetails";
import { defaultChain } from "@/lib/constants";

export const runtime = "nodejs";

type MintRequest = {
    userAddress: string;
};

export async function POST(
    req: Request & { json: () => Promise<MintRequest> },
) {
    try {
        const { userAddress } = await req.json();
        if (!userAddress) {
            return NextResponse.json({ error: "Missing userAddress" }, { status: 400 });
        }

        const privateKey = process.env.SPONSOR_WALLET_PRIVATE_KEY;
        if (!privateKey) {
            console.error("[mint-agent] Missing SPONSOR_WALLET_PRIVATE_KEY");
            return NextResponse.json(
                { error: "Server not configured with SPONSOR_WALLET_PRIVATE_KEY" },
                { status: 500 },
            );
        }
        if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
            console.error("[mint-agent] Invalid SPONSOR_WALLET_PRIVATE_KEY format");
            return NextResponse.json(
                { error: "Invalid SPONSOR_WALLET_PRIVATE_KEY format. Use 0x-prefixed 64-hex." },
                { status: 500 },
            );
        }

        const account = privateKeyToAccount(privateKey as `0x${string}`);
        const walletClient = createWalletClient({
            account,
            chain: defaultChain,
            transport: http(),
        });

        const publicClient = createPublicClient({
            chain: defaultChain,
            transport: http(),
        });

        // Pre-check: if user already has an alive agent, short-circuit with 209
        try {
            const activeAgentId = await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "getUserActiveAgentId",
                args: [userAddress as `0x${string}`],
            }) as bigint;

            try {
                const details = await publicClient.readContract({
                    address: CONTRACT_ADDRESS,
                    abi: CONTRACT_ABI,
                    functionName: "getAgentDetails",
                    args: [activeAgentId],
                }) as readonly [string, bigint, bigint, bigint, bigint, boolean];

                const isAlive = details?.[5] === true;
                if (isAlive) {
                    return NextResponse.json(
                        { error: "User agent is already alive." },
                        { status: 209 },
                    );
                }
            } catch {
                // If details cannot be read, assume no alive agent and proceed
                console.log("[mint-agent] no alive agent");
            }
        } catch {
            // If activeAgentId cannot be read, proceed with mint attempt
            console.log("[mint-agent] no active agent id");
        }

        console.log("[mint-agent] summon start", { userAddress });
        const hash = await walletClient.writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "summonBubbaAgentWithRandomTraits",
            args: [userAddress as `0x${string}`],
        });
        console.log("[mint-agent] summon success", { userAddress, hash });
        return NextResponse.json({ hash });
    } catch (error) {
        console.error("[mint-agent] Failed to send mint transaction:", error);
        return NextResponse.json({ error: "Failed to send transaction" }, { status: 500 });
    }
}
