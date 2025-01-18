import { Routes, Route } from 'react-router-dom';
import EconomyPage from './economy.page';
import HomePage from './home.page';

export default function StaticRoutes() {
  return (
    <>
      <Routes>
        <Route path="/economy" element={<EconomyPage />} />
      </Routes>
    </>
  );
};
