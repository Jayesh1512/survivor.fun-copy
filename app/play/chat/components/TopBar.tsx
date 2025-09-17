import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

interface TopBarProps {
  timeLeft: string;
  onForceEnd: () => void; 
}

export default function TopBar({ timeLeft, onForceEnd }: TopBarProps) {

  return (
    <div className="fixed top-0 left-0 right-0 bg-black/30 px-4 py-2 h-[70px] flex items-center justify-between relative">

      <div className="text-white text-xl font-bold">
        Time: {timeLeft} s
      </div>

      <button onClick={onForceEnd} className="relative w-[129px] h-[58px] select-none">
        <Image
          src="/assets/game/button_small.svg"
          alt="Kill Agent"
          width={127}
          height={45}
          className="object-cover z-0 w-[127px] h-[45px] pointer-events-none"
        />
        <span className="absolute inset-0 flex items-center justify-center text-white text-[18px] font-bold z-10">
          Kill Agent
        </span>
      </button>


    </div>
  );
}
