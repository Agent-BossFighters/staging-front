import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@features/users/auth/protectedRoute";
import { UserPreferenceProvider } from "@context/userPreference.context";
import DashboardPage from "./dashboard.page";
import LockerPage from "./locker.page";
import DatalabPage from "./datalab.page";
import DailyPage from "./daily.page";
import MonthlyPage from "./monthly.page";
import ScheduleRoutes from "./schedule/schedule.routes";
import PlayingRoutes from "./playing/playing.routes";

export default function DashboardRoutes() {
  return (
    <>
      <ProtectedRoute>
        <UserPreferenceProvider>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/locker" element={<LockerPage />} />
            <Route path="/datalab" element={<DatalabPage />} />
            <Route path="/daily" element={<DailyPage />} />
            <Route path="/monthly" element={<MonthlyPage />} />
            <Route path="/schedule/*" element={<ScheduleRoutes />} />
            {/* <Route path="/playing/*" element={<PlayingRoutes />} /> */}
          </Routes>
        </UserPreferenceProvider>
      </ProtectedRoute>
    </>
  );
}
