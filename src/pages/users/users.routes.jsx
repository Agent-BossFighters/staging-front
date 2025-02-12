import { Routes, Route } from "react-router-dom";
import AuthRoutes from "./auth/auth.routes";
import ProfilePage from "./profile.page";

export default function UsersRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<AuthRoutes />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}
