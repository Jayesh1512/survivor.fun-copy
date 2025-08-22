"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Character from './character';
import Start from './start';

const Mint: React.FC = () => {

    const [step, setStep] = useState(0);

    const handleMint = () => {
        setStep(1);
    };

    return (
        <div>
            {step == 0 && <>
                <div className="min-h-screen bg-mint-background bg-cover bg-center bg-no-repeat justify-center">
                    <div className="flex items-center justify-center">
                        <div className="flex flex-col align-middle items-center justify-center text-center absolute bottom-40 w-[351px]">
                            <div className="text-white text-wrap bg-red text-center leading-auto font-semibold text-[32px] mx-1">
                                <span className="block">Mint Your Fate</span>
                                <span className="block">Will You Survive the</span>
                                <span className="block">Reaper's Judgment?</span>
                            </div>
                            <div className="text-white text-[14px] mt-4 mx-6 text-center">
                                Summon your agent, face twisted scenarios, and outwit death in this high-stakes
                                game of survival.
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <Button onClick={handleMint} className="bg-button bg-cover bg-center bg-no-repeat w-[358px] h-[74px] absolute bottom-10 items-center justify-center flex">
                            Mint Agent
                        </Button>
                    </div>
                </div>
            </>}
            {step === 1 && <Character />}
        </div>
    );
};

export default Mint;
