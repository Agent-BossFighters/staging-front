import { Routes, Route } from 'react-router-dom';
import AuthRoutes from './auth/auth.routes';

export default function UsersRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<AuthRoutes />} />
    </Routes>
  );
}
