import { useAuth } from "@context/auth.context";
import React from "react";

export const PremiumFeatureWrapper = ({
  children,
  requiresPremium = false,
}) => {
  const { user } = useAuth();
  const isPremium = user?.isPremium === true;

  const disabledStyle =
    requiresPremium && !isPremium
      ? "opacity-50 pointer-events-none cursor-not-allowed"
      : "";

  return React.cloneElement(children, {
    disabled: requiresPremium && !isPremium,
    className: `${children.props.className || ""} ${disabledStyle}`.trim(),
  });
};
