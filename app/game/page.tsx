"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_NFT, scenarios } from "@/lib/constants";
import Image from 'next/image';
import collabBackground from '@/public/assets/game/collabBackground.webp';
import buttonBg from '@/public/assets/button.webp';

const Game: React.FC = () => {

    const router = useRouter();

    const [scenario, setScenario] = useState("");

    useEffect(() => {
        const allScenarios = scenarios(DEFAULT_NFT.name);
        const scenario = allScenarios[Math.floor(Math.random() * allScenarios.length)];
        setScenario(scenario);
    }, []);


    const handleStart = useCallback(() => {
        const nft = {
            name: DEFAULT_NFT.name,
            bio: DEFAULT_NFT.bio,
            attributes: {
                compliance: DEFAULT_NFT.attributes.compliance,
                creativity: DEFAULT_NFT.attributes.creativity,
                motivation_to_survive: DEFAULT_NFT.attributes.motivation_to_survive,
                unhingedness: DEFAULT_NFT.attributes.unhingedness,
            },
        };

        const params = new URLSearchParams({
            name: DEFAULT_NFT.name,
            scenario,
            nft: encodeURIComponent(JSON.stringify(nft)),
        });

        router.push(`/play/chat?${params.toString()}`);
    }, [scenario, router]);

    return (
        <div className="relative min-h-screen">
            <Image
                src={collabBackground}
                alt="Background"
                fill
                priority
                placeholder="blur"
                sizes="100vw"
                className="object-cover -z-10"
            />
            {/* Sound Button - Top Left */}
            <div className="absolute top-3 left-3">
                <div className="rounded-lg p-0">
                    <Image
                        src="/assets/sound.webp"
                        alt="Sound"
                        width={48}
                        height={48}
                    />
                </div>
            </div>

            {/* Scenario Section - Centered */}
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-[#D983F9] text-lg mb-4">Your Scenario</h2>
                    <div className="text-white text-[32px] font-bold leading-tight">
                        <div className="p-2">{scenario}</div>
                    </div>
                </div>
            </div>

            {/* Collaborate Button - Bottom */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center justify-center">
                    <Button onClick={handleStart} className="relative overflow-hidden w-[358px] h-[74px] items-center justify-center flex">
                        <Image src={buttonBg} alt="" aria-hidden fill sizes="358px" className="object-cover z-0 pointer-events-none" />
                        <span className="relative z-10">Convince Agent</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Game;
