import Image from 'next/image';

interface TopBarProps {
  timeLeft: string;
  onForceEnd: () => void; 
}

export default function TopBar({ timeLeft, onForceEnd }: TopBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-black/30 px-4 py-3 h-[100px] flex items-center justify-between">
      <div className="rounded-lg p-2">
        <Image
          src="/assets/sound.webp"
          alt="Sound"
          width={48}
          height={48}
        />
      </div>

      <div className="text-white text-xl font-bold">
        {timeLeft} s
      </div>

      <button onClick={onForceEnd} className="rounded-lg p-2">
        <Image
          src="/assets/game/suicide.svg"
          alt="Kill"
          width={48}
          height={48}
        />
      </button>
    </div>
  );
}
