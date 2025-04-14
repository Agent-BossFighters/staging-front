import { Routes, Route } from "react-router-dom";
import LoginPage from "./login.page";
import RegisterPage from "./register.page";
import ForgotPasswordPage from "./forgot-password.page";
import ResetPasswordPage from "./reset-password.page";

export default function UsersRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="password/forgot" element={<ForgotPasswordPage />} />
      <Route path="password/reset" element={<ResetPasswordPage />} />
    </Routes>
  );
}
