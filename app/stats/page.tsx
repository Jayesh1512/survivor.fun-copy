import TopBar from './topBar';
import StatsArea from './statsArea';

export default function StatsPage() {
  return (
    <div className="min-h-screen w-[100vw] h-screen bg-stats-page bg-no-repeat bg-cover">
      <TopBar />
      <StatsArea totalgames={42} />
    </div>
  );
}
