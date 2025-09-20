import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useBlockchain } from '@/lib/hooks/useBlockchain';

interface TopBarProps {
  timeLeft: string;
  scenario: string;
  agentName: string;
  onForceEnd?: () => void;
}

export default function TopBar({ timeLeft, scenario, agentName, onForceEnd }: TopBarProps) {
  const router = useRouter();
  const { killAgent } = useBlockchain();

  const handleKill = async () => {
    try {
      await killAgent();
    } catch (e) {
      console.error('killAgent failed', e);
    } finally {
      // Clear any lingering per-agent storage immediately on kill
      try {
        const key = `${agentName}::${scenario}`;
        localStorage.removeItem(`History:${key}`);
        localStorage.removeItem(`startTime:${key}`);
      } catch { }
      const params = new URLSearchParams({
        scenario,
        agentName,
        forced: 'dead',
      });
      router.push(`/play/judgement?${params.toString()}`);
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 px-4 py-2 h-[70px] flex items-center justify-between">

      <div className="text-white text-xl font-bold">
        Time: {timeLeft} s
      </div>

      <button onClick={handleKill} className="relative w-[129px] h-[58px] select-none">
        <Image
          src="/assets/game/button_small.svg"
          alt="Kill Agent"
          width={127}
          height={45}
          className="object-cover z-0 w-[127px] h-[45px] pointer-events-none"
        />
        <span className="absolute inset-0 flex items-center justify-center text-white text-[18px] font-bold z-10 cursor-pointer">
          Kill Agent
        </span>
      </button>


    </div>
  );
}
