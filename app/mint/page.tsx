"use client"
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Character from './character';
import Loading from './loading';
import Start from './start';
import Image from 'next/image';
import mintBackground from '@/public/assets/mint/background.webp';
import buttonBg from '@/public/assets/button.webp';
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useWriteContract, useChainId, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/contracts/contractDetails';
import { useReadContract } from 'wagmi';
import { ethers } from 'ethers'
import { Randomness } from 'randomness-js'

const Mint: React.FC = () => {

    const [step, setStep] = useState(0);

    const { data: hash, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
    const { address } = useAccount();

    const { data: readData, refetch: refetchReadData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'isUserAgentAlive',
        args: address ? [address] : undefined,
    }) as { data: bigint | undefined, refetch: () => void };

    const handleMint = async () => {
        if (readData) {
            setStep(2);
        } else {
            await mintAgent();
            setStep(1);
        }
        // show loader while waiting for confirmation
    };

    const mintAgent = async () => {
        const callbackGasLimit = 700_000;
        const jsonProvider = new ethers.JsonRpcProvider(`https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`);

        const randomness = Randomness.createBaseSepolia(jsonProvider)
        console.log("Randomness : ", randomness)
        const [requestCallBackPrice] = await randomness.calculateRequestPriceNative(BigInt(callbackGasLimit))

        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'summonBubbaAgentWithRandomTraits',
            args: [callbackGasLimit],
            value: requestCallBackPrice,
        });
    };

    useEffect(() => {
        if (isConfirmed) {
            setStep(2); // transaction confirmed → proceed to character screen
        }
    }, [isConfirmed]);

    useEffect(() => {
        console.log('isUserAgentAlive data:', readData);
    }, [readData]);

    return (
        <div>
            {step == 0 && <>
                <div className="relative min-h-screen justify-center">
                    <Image
                        src={mintBackground}
                        alt="Mint background"
                        fill
                        priority
                        placeholder="blur"
                        sizes="100vw"
                        className="object-cover -z-10"
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
