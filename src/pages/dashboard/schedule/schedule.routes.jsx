import { Routes, Route } from "react-router-dom";
import DailyPage from "./daily.page";
import MonthlyPage from "./monthlypage.page";
import SchedulePage from "./schedule.page";
import { useAuth } from "@context/auth.context";
import { Navigate } from "react-router-dom";

const ProtectedMonthlyPage = () => {
  const { user } = useAuth();
  const isPremium = user?.isPremium === true;

  if (!isPremium) {
    return <Navigate to="/dashboard" replace />;
  }

  return <MonthlyPage />;
};

export default function ScheduleRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SchedulePage />} />
        <Route path="/daily" element={<DailyPage />} />
        <Route path="/monthly" element={<ProtectedMonthlyPage />} />
      </Routes>
    </>
  );
}
