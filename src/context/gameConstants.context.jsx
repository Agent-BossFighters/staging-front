import { createContext, useContext } from "react";

// Constantes du jeu
export const GAME_MAPS = ["Toxic river", "Award", "Radiation rift"];
export const GAME_RESULTS = ["win", "loss", "draw"];

export const CURRENCY_RATES = {
  BFT: 0.01, // Prix du BFT en USD ($0.01)
  FLEX: 0.00744, // Prix du FLEX en USD ($0.00744)
  ENERGY: 1.49, // Prix de l'énergie en USD ($1.49)
};

export const RARITY_MULTIPLIERS = {
  common: 1,
  uncommon: 1.5,
  rare: 2,
  epic: 2.5,
  legendary: 3,
  mythic: 3.5,
};

// Consommation d'énergie par minute
export const ENERGY_CONSUMPTION = {
  RATE_PER_MINUTE: 0.083, // ~0.83 pour 10 minutes
};

// Multiplicateurs de rareté pour le luck rate (base * multiplier)
export const LUCK_RATES = {
  common: 100, // 100 * 1
  uncommon: 205, // 100 * 2.05
  rare: 420, // 100 * 4.2
  epic: 1292, // 100 * 12.92
  legendary: 3974, // 100 * 39.74
  mythic: 12219, // 100 * 122.19
  exalted: 37574, // 100 * 375.74
  exotic: 154054,
  transcendant: 631620,
  unique: 2589642,
};

const GameConstantsContext = createContext({
  GAME_MAPS,
  GAME_RESULTS,
  CURRENCY_RATES,
  RARITY_MULTIPLIERS,
  ENERGY_CONSUMPTION,
  LUCK_RATES,
});

export function useGameConstants() {
  return useContext(GameConstantsContext);
}

export function GameConstantsProvider({ children }) {
  return (
    <GameConstantsContext.Provider
      value={{
        GAME_MAPS,
        GAME_RESULTS,
        CURRENCY_RATES,
        RARITY_MULTIPLIERS,
        ENERGY_CONSUMPTION,
        LUCK_RATES,
      }}
    >
      {children}
    </GameConstantsContext.Provider>
  );
}
