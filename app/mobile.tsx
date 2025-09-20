"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAppKit } from "@reown/appkit/react";
import { useAccount } from 'wagmi';
import backgroundImage from '@/public/assets/background.webp';
import logoImage from '@/public/assets/logo.webp';
import buttonBg from '@/public/assets/button.webp';

const Mobile: React.FC = () => {
  const router = useRouter();
  const { open } = useAppKit();
  const account = useAccount();
  const isConnected = account.isConnected;

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <Image
        src={backgroundImage}
        alt="Background"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover z-0 pointer-events-none"
      />

      {/* Logo */}
      <Image
        src={logoImage}
        alt="Survivor.fun Logo"
        width={322}
        height={124}
        priority
        className="mx-auto pt-10"
      />

      {/* Button + Profile container */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-end">
        { isConnected && (
        <div
            className="w-12 h-12 mb-2 cursor-pointer"
            onClick={() => router.push('/stats')}
        >
            <Image
            src="/assets/game/profile.png"
            alt="Profile"
            width={48}
            height={48}
            />
        </div>
        )}

        {/* Button */}
        {isConnected ? (
            <Button
            onClick={() => router.push('/tournament')}
            className="relative overflow-hidden text-2xl h-[74px] items-center justify-center flex w-[358px]"
            >
            <Image
                src={buttonBg}
                alt=""
                aria-hidden
                fill
                sizes="358px"
                className="object-cover z-0 pointer-events-none"
            />
            <span className="relative z-10">Start Game</span>
            </Button>
        ) : (
            <Button
            onClick={() => open()}
            className="relative overflow-hidden w-[358px] h-[74px] flex items-center justify-center text-2xl font-bold"
            >
            <Image
                src={buttonBg}
                alt=""
                aria-hidden
                fill
                sizes="358px"
                className="object-cover z-0 pointer-events-none"
            />
            <span className="relative z-10">Enter Game</span>
            </Button>
        )}
        </div>
</div>
  );
};

export default Mobile;
