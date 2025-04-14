import { createContext, useContext, useState, useEffect } from "react";
import { kyInstance } from "@utils/api/ky-config";
import { useAuth } from "@context/auth.context";

// Constantes du jeu
export const GAME_MAPS = ["Toxic river", "Award", "Radiation rift"];
export const GAME_RESULTS = ["win", "loss", "draw"];

export let CURRENCY_RATES = {
  BFT: 0.0230, // Prix du BFT en USD ($0.01)
  FLEX: 0.0104, // Prix du FLEX en USD ($0.00744)
  SPONSOR_MARKS: 0.0280, // Prix du FLEX en USD ($0.00744)
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
  transcendent: 631620,
  unique: 2589642,
};

const GameConstantsContext = createContext({
  GAME_MAPS,
  GAME_RESULTS,
  RARITY_MULTIPLIERS,
  ENERGY_CONSUMPTION,
  LUCK_RATES,
});

export function useGameConstants() {
  return useContext(GameConstantsContext);
}

export function GameConstantsProvider({ children }) {
  const [currencyRates, setCurrencyRates] = useState(CURRENCY_RATES);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Fonction pour récupérer les taux de devises du backend
  const fetchCurrencyRates = async () => {
    if (!user) return; // Ne pas faire la requête si l'utilisateur n'est pas connecté

    try {
      setIsLoading(true);

      // Récupérer les devises depuis l'API
      const response = await kyInstance.get("v1/currencies").json();

      // Trouver les devises spécifiques
      const bftCurrency = response.find((c) => c.name === "$BFT");
      const flexCurrency = response.find((c) => c.name === "FLEX");
      const sponsorMarksCurrency = response.find(
        (c) => c.name === "Sponsor Marks"
      );

      if (bftCurrency && flexCurrency && sponsorMarksCurrency) {
        // Mettre à jour les taux
        const newRates = {
          BFT: bftCurrency.price,
          FLEX: flexCurrency.price,
          SPONSOR_MARKS: sponsorMarksCurrency.price,
          // Autres taux si nécessaire
        };

        setCurrencyRates(newRates);

        // Important: mettre à jour également la variable exportée
        CURRENCY_RATES.BFT = bftCurrency.price;
        CURRENCY_RATES.FLEX = flexCurrency.price;
        CURRENCY_RATES.SPONSOR_MARKS = sponsorMarksCurrency.price;

        return newRates;
      }

      return currencyRates;
    } catch (error) {
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les taux au démarrage et quand l'utilisateur change
  useEffect(() => {
    fetchCurrencyRates();
  }, [user]);

  return (
    <GameConstantsContext.Provider
      value={{
        GAME_MAPS,
        GAME_RESULTS,
        CURRENCY_RATES: currencyRates,
        RARITY_MULTIPLIERS,
        ENERGY_CONSUMPTION,
        LUCK_RATES,
        fetchCurrencyRates,
      }}
    >
      {children}
    </GameConstantsContext.Provider>
  );
}
