import { useAuth } from "@context/auth.context";
import React, { useContext } from "react";
import { isPremiumContext } from "@context/auth.context";

export default function FreemiumControl({ children, defaultValue }) {
  const { isPremium } = useContext(isPremiumContext);
  // Clone l'élément enfant et ajoute la prop disabled si l'utilisateur n'est pas premium
  const childrenWithProps = React.Children.map(children, (child) => {
    if (!isPremium) {
      return React.cloneElement(child, {
        disabled: true,
        value: defaultValue,
      });
    }
    return child;
  });

  return <>{childrenWithProps}</>;
}
 