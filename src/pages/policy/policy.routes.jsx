import { Routes, Route } from 'react-router-dom';
import PrivacyPage from './privacy.page';
import TermsPage from './terms.page';

export default function PolicyRoutes() {
  return (
    <>
      <Routes>
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
    </>
  );
};
