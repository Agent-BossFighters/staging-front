import { Routes, Route } from "react-router-dom";
import TournamentListPage from "./tournament-list.page";
import TournamentDetailsPage from "./tournament-details.page";
import TeamManagePage from "./team-manage.page";
import MatchDetailsPage from "./match-details.page";
import TournamentEditPage from "./tournament-edit.page";

export default function TournamentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TournamentListPage />} />
      <Route path=":tournamentId" element={<TournamentDetailsPage />} />
      <Route path=":tournamentId/edit" element={<TournamentEditPage />} />
      <Route path=":tournamentId/teams/:teamId" element={<TeamManagePage />} />
      <Route path=":tournamentId/matches/:matchId" element={<MatchDetailsPage />} />
    </Routes>
  );
} 