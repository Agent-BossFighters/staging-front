import { useAuth } from "@context/auth.context";
import React from "react";

export default function FreemiumControl({ children, defaultValue }) {
  const { user } = useAuth();
  const isPremium = user?.isPremium === true;

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
