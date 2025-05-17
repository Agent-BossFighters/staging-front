import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@features/users/auth/protectedRoute";
import { UserPreferenceProvider } from "@context/userPreference.context";
import DashboardPage from "./dashboard.page";
import LockerPage from "./locker.page";
import DatalabPage from "./datalab.page";
import MissionPage from "./mission.page";
import ScheduleRoutes from "./schedule/schedule.routes";
import PlayingRoutes from "./playing/playing.routes";
import TournamentRoutes from "./tournaments/tournament.routes";
import PlayerMapRoutes from "./playerMap/playerMap.routes";

export default function DashboardRoutes() {
  return (
    <>
      <ProtectedRoute>
        <UserPreferenceProvider>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="locker" element={<LockerPage />} />
            <Route path="datalab" element={<DatalabPage />} />
            <Route path="missions" element={<MissionPage />} />
            <Route
              path="daily"
              element={<Navigate to="schedule/daily" replace />}
            />
            <Route
              path="monthly"
              element={<Navigate to="schedule/monthly" replace />}
            />
            <Route path="schedule/*" element={<ScheduleRoutes />} />
            <Route path="fighting/*" element={<TournamentRoutes />} />
            <Route path="playermap/*" element={<PlayerMapRoutes />} />
            {/* <Route path="playing/*" element={<PlayingRoutes />} /> */}
          </Routes>
        </UserPreferenceProvider>
      </ProtectedRoute>
    </>
  );
}
