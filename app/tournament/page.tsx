import TopBar from './topBar';
import TournamentArea from './tournamentArea';
import Image from 'next/image';
import statsBackground from '@/public/assets/stats/bg-stats.svg';

export default function TournamentPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Image
        src={statsBackground}
        alt="Background"
        fill
        priority
        sizes="100vw"
        className="object-cover z-0 pointer-events-none"
      />
      <TopBar />
      <div className="pt-[100px] pb-4 px-4">
        <TournamentArea />
      </div>
    </div>
  );
}
