"use client"
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Character from './character';
import Loading from './loading';
import Image from 'next/image';
import mintBackground from '@/public/assets/mint/background.webp';
import buttonBg from '@/public/assets/button.webp';
import { useAccount, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/contracts/contractDetails';
import Link from 'next/link';

const Mint: React.FC = () => {

    const [step, setStep] = useState(0);
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

    const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });
    const { address } = useAccount();
    // Active agent id for this user
    const { data: activeAgentId } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getUserActiveAgentId',
        args: address ? [address] : undefined,
        // Ensure fresh reads on navigation
        query: { staleTime: 0 },
    }) as { data: bigint | undefined };
    // Agent details to check alive flag
    const { data: agentDetails } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getAgentDetails',
        args: typeof activeAgentId !== 'undefined' ? [activeAgentId] : undefined,
        query: { staleTime: 0 },
    }) as { data: readonly [string, bigint, bigint, bigint, bigint, boolean] | undefined };

    const handleMint = async () => {
        const isAlive = agentDetails ? agentDetails[5] : false;
        if (isAlive) {
            setStep(2);
            return;
        }
        const ok = await mintAgent();
        if (ok) setStep(1);
    };

    const mintAgent = async () => {
        if (!address) return;
        try {
            const res = await fetch('/api/mint-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userAddress: address }),
            });
            const data = await res.json();
            if (!res.ok) {
                console.error('Mint failed:', data?.error || res.statusText);
                // If server says agent already alive, skip loader and go to character
                const errorMsg = (data?.error || '').toString().toLowerCase();
                if (res.status === 209 || res.status === 409 || errorMsg.includes('already alive')) {
                    setStep(2);
                }
                return false;
            }
            console.log('Mint tx hash:', data.hash);
            setTxHash(data.hash as `0x${string}`);
            return true;
        } catch (e) {
            console.error('Mint request failed:', e);
            return false;
        }
    };

    useEffect(() => {
        if (isConfirmed) {
            setStep(2); // transaction confirmed → proceed to character screen
        }
    }, [isConfirmed]);

    // If chain says agent is alive, skip to character immediately unless requireMint flag is set
    useEffect(() => {
        const alive = agentDetails ? agentDetails[5] : false;
        const requireMint = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('requireMint') === '1';
        if (!requireMint && alive && step !== 2) {
            setStep(2);
        }
    }, [agentDetails, step]);

    // no-op debug hook removed
    useEffect(() => {
        try {
            if (typeof activeAgentId !== 'undefined') {
                console.log('activeAgentId:', activeAgentId?.toString());
            }
            if (agentDetails) {
                const isAlive = agentDetails[5];
                console.log('agentDetails:', agentDetails, 'isAlive:', isAlive);
            }
        } catch (e) {
            console.log('agent debug error', e);
        }
    }, [activeAgentId, agentDetails]);

    return (
        <div>
            {step == 0 && <>
                <div className="relative isolate min-h-screen justify-center">
                    <Link href={'/'}>
                        <Image
                            src="/assets/back.svg"
                            alt="Sound"
                            width={48}
                            height={48}
                            className="absolute top-4 left-4 z-10"
                        />
                    </Link>
                    <Image
                        src={mintBackground}
                        alt="Mint background"
                        fill
                        priority
                        placeholder="blur"
                        sizes="100vw"
                        className="object-cover -z-10 pointer-events-none"
                    />
                    <div className="flex items-center justify-center">
                        <div className="flex flex-col align-middle items-center justify-center text-center absolute bottom-40 w-[351px]">
                            <div className="text-white text-wrap bg-red text-center leading-auto font-semibold text-[32px] mx-1">
                                <span className="block">Can you protect</span>
                                <span className="block">your agent from</span>
                                <span className="block">certain death?</span>
                            </div>
                            <div className="text-white text-[14px] mt-4 mx-6 text-center">
                                Summon your agent, face twisted scenarios together, and outwit death in this high-stakes game of survival.
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center">
                        <Button onClick={handleMint} className="relative overflow-hidden text-[24px] w-[358px] h-[74px] items-center justify-center flex">
                            <Image src={buttonBg} alt="" aria-hidden fill sizes="358px" className="object-cover z-0 pointer-events-none" />
                            <span className="relative z-10">Summon Agent</span>
                        </Button>
                    </div>
                </div>
            </>}
            {step === 1 && <Loading />}
            {step === 2 && <Character />}
        </div>
    );
};

export default Mint;
