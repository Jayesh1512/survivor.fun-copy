import TopBar from './topBar';
import Image from 'next/image';
import AgentStats from './AgentStats';

export default function AgentInfoPage() {
  return (
    <div className="min-h-screen w-[390px] h-[844px] bg-mint-info bg-cover bg-center bg-no-repeat flex flex-col">
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
