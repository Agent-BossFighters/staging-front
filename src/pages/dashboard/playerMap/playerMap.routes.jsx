import { Routes, Route } from "react-router-dom";
import PlayerMapView from "./playerMapView";

export default function PlayerMapRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PlayerMapView />} />
    </Routes>
  );
}