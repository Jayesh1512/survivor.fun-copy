import TopBar from '../../stats/topBar';
import Image from 'next/image';
import AgentStats from './AgentStats';


export default function StatsPage() {
  return (
    <div className="min-h-screen w-[390px] h-[844px] bg-mint bg-[length:390px_844px] bg-no-repeat bg-center flex flex-col">
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