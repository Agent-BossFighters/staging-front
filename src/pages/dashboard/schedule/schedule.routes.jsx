import { Routes, Route } from "react-router-dom";
import DailyPage from "./daily.page";
import MonthlyPage from "./monthlypage.page";
import SchedulePage from "./schedule.page";

export default function ScheduleRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SchedulePage />} />
        <Route path="/daily" element={<DailyPage />} />
        <Route path="/monthly" element={<MonthlyPage />} />
      </Routes>
    </>
  );
}
