import { Routes, Route } from "react-router-dom";
import FightingPage from "./fighting.page";
import PlayerMapPage from "./player-map.page";
import TvToolsPage from "./tv-tools.page";

export default function PolicyRoutes() {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<FightingPage />} /> */}
        {/* <Route path="/player-map" element={<PlayerMapPage />} /> */}
        {/* <Route path="/tv-tools" element={<TvToolsPage />} /> */}
      </Routes>
    </>
  );
}
