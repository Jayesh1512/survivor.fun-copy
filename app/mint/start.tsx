"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const Start: React.FC = () => {

    const characterData = {
        name: "Bubba the Brave",
        image: "/assets/characters/two.webp",
        stats: {
            compliance: 56,
            creativity: 21,
            unhingedness: 88,
            motivationToSurvive: 35
        },
        bio: "Bubba lives for dares, gym selfies, and shouting “watch this” before doing something dumb. He is the kind of guy who thinks running headfirst at danger is a personality trait."
    };

    const router = useRouter();

    return (
        <div className="min-h-screen bg-startgame  bg-cover bg-center bg-no-repeat">

            <div className="absolute bottom-0">
                <div className='flex justify-center items-center'>
                    <Image
                        src="/assets/characters/two.webp"
                        alt="gameBackground"
                        width={317}
                        height={361.21}
                    />
                </div>
                <div className="bg-[#030229] w-full h-[450px] rounded-t-[60px] ">
                    <div className="flex flex-col p-8 h-full">
                        {/* Character Profile Section */}
                        <div className="flex items-center mb-6">
                            <Image
                                src={characterData.image}
                                alt={characterData.name}
                                width={80}
                                height={80}
                                className="w-20 h-20 rounded-full mr-4 bg-gray-500"
                            />
                            <div>
                                <p className="text-purple-300 text-sm">Name</p>
                                <h1 className="text-white text-2xl font-bold">{characterData.name}</h1>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="mb-6">
                            <div className="text-gray-300 text-sm">
                                <span>COMPLIANCE: <span className="text-white font-bold">{characterData.stats.compliance}</span></span>
                                <span className="mx-2">|</span>
                                <span>CREATIVITY: <span className="text-white font-bold">{characterData.stats.creativity}</span></span>
                                <span className="mx-2">|</span>
                                <span>UNHINGED-NESS: <span className="text-white font-bold">{characterData.stats.unhingedness}</span></span>
                                <span className="mx-2">|</span>
                                <span>MOTIVATION TO SURVIVE: <span className="text-white font-bold">{characterData.stats.motivationToSurvive}</span></span>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="mb-8">
                            <h2 className="text-purple-300 text-lg mb-2">Bio</h2>
                            <p className="text-gray-300 text-sm">{characterData.bio}</p>
                        </div>

                        {/* Start Game Button */}
                        <div className="flex items-center justify-center">
                            <Button onClick={() => router.push('/game')} className="bg-button bg-cover bg-center bg-no-repeat w-[358px] h-[74px] absolute bottom-10 items-center justify-center flex">
                                Enter Scenario
                            </Button>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Start;
