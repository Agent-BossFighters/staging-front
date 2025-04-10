import { Routes, Route } from "react-router-dom";
import TournamentListPage from "./tournament-list.page";

export default function TournamentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TournamentListPage />} />
    </Routes>
  );
} 