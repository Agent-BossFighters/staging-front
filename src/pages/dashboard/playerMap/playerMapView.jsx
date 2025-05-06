import { PlayerMapHome, RegistrationForm, GraphComponent, PlayerMapGraph } from 'player-map';

export default function PlayerMapView() {
  return (
  <div className="w-5/6 mx-auto h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-5xl font-extrabold pt-8 pb-2 text-primary">PLAYER MAP</h1>
      </div>

    <PlayerMapHome />
    <GraphComponent />
    <RegistrationForm />
    <PlayerMapGraph />
  </div>
  );
}