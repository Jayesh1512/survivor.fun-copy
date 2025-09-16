import TopBar from '../../stats/topBar';
import Image from 'next/image';
import AgentStats from './AgentStats';
import mintBg from '@/public/assets/mint/info-bg.png';


export default function StatsPage() {
  return (
    <div className="relative min-h-screen w-[390px] h-[844px] flex flex-col">
      <Image src={mintBg} alt="" aria-hidden fill sizes="390px" className="object-cover -z-10" />
      <TopBar />
      <div className="flex-1 flex items-center justify-center p-2">
        <Image
          src="/assets/characters/one.webp"
          alt="agent"
          width={390}
          height={364}
        ></Image>
      </div>
      <div className="mt-auto">
        <AgentStats />
      </div>
    </div>
  );
}
