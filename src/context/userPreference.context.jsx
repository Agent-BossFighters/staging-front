import { createContext, useContext, useState } from "react";

const UserPreferenceContext = createContext();

export function useUserPreference() {
  return useContext(UserPreferenceContext);
}

export function UserPreferenceProvider({ children }) {
  const [maxRarity, setMaxRarity] = useState(null);
  const [unlockedSlots, setUnlockedSlots] = useState(2);

  return (
    <UserPreferenceContext.Provider
      value={{
        maxRarity,
        setMaxRarity,
        unlockedSlots,
        setUnlockedSlots,
      }}
    >
      {children}
    </UserPreferenceContext.Provider>
  );
}
