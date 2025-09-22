import Image from 'next/image';

interface TopBarProps {
  timeLeft: string;
  scenario: string;
  agentName: string;
  onForceEnd?: () => void;
  onDone?: () => void;
}

export default function TopBar({ timeLeft, scenario, agentName, onForceEnd, onDone }: TopBarProps) {
  const handleDone = () => {
    if (onDone) {
      onDone();
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 px-4 py-2 h-[70px] flex items-center justify-between">

      <div className="text-white text-xl font-bold">
        Time: {timeLeft} s
      </div>

      <button onClick={handleDone} className="relative w-[129px] h-[58px] select-none">
        <Image
          src="/assets/game/button_small.svg"
          alt="I'm done"
          width={127}
          height={45}
          className="object-cover z-0 w-[127px] h-[45px] pointer-events-none"
        />
        <span className="absolute inset-0 flex items-center justify-center text-white text-[18px] font-bold z-10 cursor-pointer">
          I'm done
        </span>
      </button>
    </div>
  );
}
