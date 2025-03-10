import { useAuth } from "@context/auth.context";
import { Navigate } from "react-router-dom";

export const withPremiumProtection = (WrappedComponent) => {
  return function PremiumProtectedComponent(props) {
    const { user } = useAuth();

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (!user.isPremium) {
      return <Navigate to="/payments/pricing" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};
