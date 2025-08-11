import { Routes, Route } from "react-router-dom";
import EconomyPage from "./economy.page";
import OpensourcePage from "./opensource.page";

export default function StaticRoutes() {
  return (
    <>
      <Routes>
        <Route path="/economy" element={<EconomyPage />} />
        <Route path="/opensource" element={<OpensourcePage />} />
      </Routes>
    </>
  );
}
