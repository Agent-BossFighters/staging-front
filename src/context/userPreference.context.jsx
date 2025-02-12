import { createContext, useContext, useState } from "react";

const UserPreferenceContext = createContext();

export function useUserPreference() {
  return useContext(UserPreferenceContext);
}

export function UserPreferenceProvider({ children }) {
  const [maxRarity, setMaxRarity] = useState(null);

  return (
    <UserPreferenceContext.Provider
      value={{
        maxRarity,
        setMaxRarity,
      }}
    >
      {children}
    </UserPreferenceContext.Provider>
  );
}
