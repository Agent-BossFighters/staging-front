import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@context/auth.context";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/users/login" state={{ from: location }} replace />;
  }

  return children;
};
