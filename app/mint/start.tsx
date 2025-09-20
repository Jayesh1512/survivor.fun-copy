"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/contracts/contractDetails';
import gameBackground from '@/public/assets/game/gameBackground.webp';
import buttonBg from '@/public/assets/button.webp';

const Start: React.FC = () => {

    const [computedStats, setComputedStats] = useState({
        compliance: 0,
        creativity: 0,
        unhingedness: 0,
        motivationToSurvive: 0
    });

    const characterData = {
        name: "Bubba the Brave",
        image: "/assets/characters/two.webp",
        bio: "Bubba lives for dares, gym selfies, and shouting “watch this” before doing something dumb. He is the kind of guy who thinks running headfirst at danger is a personality trait."
    };

    const router = useRouter();

    const { address } = useAccount();
    const { data: activeAgentId } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getUserActiveAgentId',
        args: address ? [address] : undefined,
    }) as { data: bigint | undefined };

    const { data: agentDetails } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getAgentDetails',
        args: typeof activeAgentId !== 'undefined' ? [activeAgentId] : undefined,
    }) as { data: readonly [string, bigint, bigint, bigint, bigint, boolean] | undefined };

    useEffect(() => {
        if (agentDetails) {
            const [owner, compliance, creativity, unhingedness, motivation, isAlive] = agentDetails;
            setComputedStats({
                compliance: Number(compliance),
                creativity: Number(creativity),
                unhingedness: Number(unhingedness),
                motivationToSurvive: Number(motivation)
            });
        }
    }, [agentDetails]);

    return (
        <div className="relative isolate min-h-screen">
            <Image
                src={gameBackground}
                alt="Game background"
                fill
                priority
                placeholder="blur"
                sizes="100vw"
                className="object-cover z-0 pointer-events-none"
            />

            <div className="absolute bottom-0 z-10">
                <div className='flex justify-center items-center'>
                    <Image
                        src="/assets/characters/two.webp"
                        alt="gameBackground"
                        width={317}
                        height={361.21}
                    />
                </div>
                <div className="bg-[#030229] w-full h-[450px] rounded-t-[60px] relative z-10 ">
                    <div className="flex flex-col p-6 h-full">

                        <div className='flex flex-row'>
                            {/* Character Profile Section */}
                            <div className="flex flex-col items-center text-center mb-6">
                                <Image
                                    src={characterData.image}
                                    alt={characterData.name}
                                    width={96}
                                    height={96}
                                    className="w-24 h-24 rounded-full mb-3 bg-gray-500"
                                />
                                <div>
                                    <p className="text-purple-300 text-sm">{characterData.name}</p>
                                </div>
                            </div>

                            {/* Stats Section */}
                            <div className="mb-6 ml-6 mt-3">
                                <div className="text-gray-300 text-sm flex flex-col gap-3">
                                    <div className="flex items-baseline justify-between">
                                        <span>COMPLIANCE</span>
                                        <span className="text-white font-bold">&nbsp;&nbsp;&nbsp;&nbsp;{computedStats.compliance}</span>
                                    </div>
                                    <div className="flex items-baseline justify-between">
                                        <span>CREATIVITY</span>
                                        <span className="text-white font-bold">&nbsp;&nbsp;&nbsp;&nbsp;{computedStats.creativity}</span>
                                    </div>
                                    <div className="flex items-baseline justify-between">
                                        <span>UNHINGED-NESS</span>
                                        <span className="text-white font-bold">&nbsp;&nbsp;&nbsp;&nbsp;{computedStats.unhingedness}</span>
                                    </div>
                                    <div className="flex items-baseline justify-between">
                                        <span>MOTIVATION TO SURVIVE </span>
                                        <span className="text-white font-bold">&nbsp;&nbsp;&nbsp;&nbsp;{computedStats.motivationToSurvive}</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Bio Section */}
                        <div className="mb-8">
                            <h2 className="text-purple-300 text-lg mb-2">Bio</h2>
                            <p className="text-gray-300 text-sm">{characterData.bio}</p>
                        </div>

                        {/* Start Game Button */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                            <Button onClick={() => router.push('/game')} className="relative overflow-hidden w-[358px] h-[74px] items-center justify-center flex">
                                <Image src={buttonBg} alt="" aria-hidden fill sizes="358px" className="object-cover z-0 pointer-events-none" />
                                <span className="relative z-10">Enter Scenario</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Start;
