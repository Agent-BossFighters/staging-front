import { Routes, Route } from 'react-router-dom';
import DashboardPage from './dashboard.page';
import VestiaryPage from './vestiary.page';
import DatalabPage from './datalab.page';
import FarmingRoutes from './farming/farming.routes';
import PlayingRoutes from './playing/playing.routes';

export default function DashboardRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/vestiary" element={<VestiaryPage />} />
        <Route path="/datalab" element={<DatalabPage />} />
        <Route path="/farming/*" element={<FarmingRoutes />} />
        <Route path="/playing/*" element={<PlayingRoutes />} />
      </Routes>
    </>
  );
};

