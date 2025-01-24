import { Routes, Route } from "react-router-dom";
import FarmingPage from "./farming.page";
import DailyPage from "./daily.page";
import MonthlyPage from "./monthlypage.page";

export default function PolicyRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<FarmingPage />} />
        <Route path="/daily" element={<DailyPage />} />
        <Route path="/monthly" element={<MonthlyPage />} />
      </Routes>
    </>
  );
}
