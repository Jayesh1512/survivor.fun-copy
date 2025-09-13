import TopBar from './topBar';
import TournamentArea from './tournamentArea';

export default function TournamentPage() {
  return (
    <div className="min-h-screen bg-stats-page bg-cover bg-center bg-no-repeat bg-fixed">
      <TopBar />
      <div className="pt-[100px] pb-4 px-4">
        <TournamentArea />
      </div>
    </div>
  );
}
