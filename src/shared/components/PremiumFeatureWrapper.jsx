import { useAuth } from "@context/auth.context";
import React from "react";

export const PremiumFeatureWrapper = ({
  children,
  requiresPremium = false,
}) => {
  const { user } = useAuth();
  const isPremium = user?.isPremium === true;

  if (requiresPremium && !isPremium) {
    return (
      <div className="opacity-50 pointer-events-none cursor-not-allowed h-full w-full">
        {children}
      </div>
    );
  }

  return children;
};
