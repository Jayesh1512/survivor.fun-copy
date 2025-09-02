"use client"
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Character from './character';
import Loading from './loading';
import Start from './start';
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
                <div className="min-h-screen bg-mint-background bg-cover bg-center bg-no-repeat justify-center">
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
                    <div className="flex items-center justify-center">
                        <Button onClick={handleMint} className="bg-button bg-cover bg-center bg-no-repeat w-[358px] h-[74px] absolute bottom-10 items-center justify-center flex">
                            Summon Agent
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
