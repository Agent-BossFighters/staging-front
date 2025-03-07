import { Routes, Route } from "react-router-dom";
import LoginPage from "./login.page";
import RegisterPage from "./register.page";

export default function UsersRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
    </Routes>
  );
}
