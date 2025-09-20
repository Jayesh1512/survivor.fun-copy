import TopBar from './topBar';
import Image from 'next/image';
import AgentStats from './AgentStats';
import mintInfoBg from '@/public/assets/mint/info-bg.png';

export default function AgentInfoPage() {
  return (
    <div className="relative isolate w-full min-h-screen flex flex-col">
      {/* Background */}
      <Image
        src={mintInfoBg}
        alt="Background"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover -z-10 pointer-events-none"
      />

      {/* Top bar */}
      <TopBar />

      {/* Character Image */}
      <div className="flex-1 flex items-end justify-center p-2 pb-0">
        <Image
          src="/assets/characters/one.webp"
          alt="agent"
          width={390}
          height={364}
          className="object-contain"
        />
      </div>

      {/* Agent Stats */}
      <div className="flex-shrink-0">
        <AgentStats />
      </div>
    </div>
  );
}
