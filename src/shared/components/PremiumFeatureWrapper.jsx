import { useAuth } from "@context/auth.context";
import React from "react";

export const PremiumFeatureWrapper = ({
  children,
  requiresPremium = false,
}) => {
  const { user } = useAuth();
  const isPremium = user?.isPremium === true;

  return React.cloneElement(children, {
    disabled: requiresPremium && !isPremium,
  });
};
