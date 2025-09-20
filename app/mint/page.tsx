"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Character from './character';
import Image from 'next/image';
import mintBackground from '@/public/assets/mint/background.webp';
import buttonBg from '@/public/assets/button.webp';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import AgentInfoPage from './agentinfo/page';

const Mint: React.FC = () => {

    const [step, setStep] = useState(0);
    const { address } = useAccount();

    const handleMint = async () => {
        const ok = await mintAgent();
        if (ok) setStep(2);
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
            // Proceed directly to play screen (step 2) without waiting for confirmation
            return true;
        } catch (e) {
            console.error('Mint request failed:', e);
            return false;
        }
    };

    return (
        <div>
            {step == 0 && <>
                <div className="relative isolate min-h-screen justify-center">
                    <Link href={'/'}>
                        <Image
                            src="/assets/back.svg"
                            alt="back"
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
            {step === 2 && <AgentInfoPage />}
        </div>
    );
};

export default Mint;
