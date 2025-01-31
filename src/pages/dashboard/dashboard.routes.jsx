import { Routes, Route } from "react-router-dom";
import DashboardPage from "./dashboard.page";
import LockerPage from "./locker.page";
import DatalabPage from "./datalab.page";
import ScheduleRoutes from "./schedule/schedule.routes";
import PlayingRoutes from "./playing/playing.routes";

export default function DashboardRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/locker" element={<LockerPage />} />
        <Route path="/datalab" element={<DatalabPage />} />
        <Route path="/schedule/*" element={<ScheduleRoutes />} />
        <Route path="/playing/*" element={<PlayingRoutes />} />
      </Routes>
    </>
  );
}
