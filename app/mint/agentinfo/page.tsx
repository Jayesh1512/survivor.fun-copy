import TopBar from './topBar';
import Image from 'next/image';
import AgentStats from './AgentStats';
import mintInfoBg from '@/public/assets/mint/info-bg.png';

export default function AgentInfoPage() {
  return (
    <div className="relative min-h-screen w-full h-[844px] flex flex-col">
      <Image
        src={mintInfoBg}
        alt="Background"
        fill
        priority
        className="object-cover -z-10 w-full"
      />
      <TopBar />
      <div className="flex-1 flex items-end justify-center p-2 pb-0">
        <Image
          src="/assets/characters/one.webp"
          alt="agent"
          width={390}
          height={364}
        ></Image>
      </div>
      <div>
        <AgentStats />
      </div>
    </div>
  );
}
