import TopBar from './topBar';
import StatsArea from './statsArea';
import Image from 'next/image';
import statsBackground from '@/public/assets/stats/bg-stats.svg';

export default function StatsPage() {
  return (
    <div className="relative min-h-screen w-[100vw] h-screen">
      <Image
        src={statsBackground}
        alt="Background"
        fill
        priority
        sizes="100vw"
        className="object-cover -z-10"
      />
      <TopBar />
      <StatsArea totalgames={42} />
    </div>
  );
}
