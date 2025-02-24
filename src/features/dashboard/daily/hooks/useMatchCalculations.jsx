import { useCallback } from "react";
import { useGameConstants } from "@context/gameConstants.context";

export const useMatchCalculations = () => {
  const { CURRENCY_RATES, ENERGY_CONSUMPTION, LUCK_RATES } = useGameConstants();

  const calculateEnergyUsed = useCallback(
    (timeInMinutes) => {
      if (!timeInMinutes) return 0;
      return (timeInMinutes * ENERGY_CONSUMPTION.RATE_PER_MINUTE).toFixed(2);
    },
    [ENERGY_CONSUMPTION.RATE_PER_MINUTE]
  );

  const calculateEnergyCost = useCallback(
    (energyUsed) => {
      return (energyUsed * CURRENCY_RATES.ENERGY).toFixed(2);
    },
    [CURRENCY_RATES.ENERGY]
  );

  const calculateTokenValue = useCallback(
    (totalToken) => {
      return (totalToken * CURRENCY_RATES.BFT).toFixed(2);
    },
    [CURRENCY_RATES.BFT]
  );

  const calculatePremiumValue = useCallback(
    (totalPremium) => {
      return (totalPremium * CURRENCY_RATES.FLEX).toFixed(2);
    },
    [CURRENCY_RATES.FLEX]
  );

  const calculateLuckrate = useCallback(
    (badges) => {
      if (!badges || !Array.isArray(badges)) return 0;
      return badges
        .filter((badge) => badge && badge !== "none")
        .reduce((total, badge) => {
          const rarity = typeof badge === "object" ? badge.rarity : badge;
          return total + (LUCK_RATES[rarity?.toLowerCase()] || 0);
        }, 0);
    },
    [LUCK_RATES]
  );

  const calculateProfit = useCallback(
    (match) => {
      if (!match) return "0.00";

      const bftValue = parseFloat(calculateTokenValue(match.totalToken));
      const flexValue = parseFloat(
        calculatePremiumValue(match.totalPremiumCurrency)
      );
      const energyUsed = calculateEnergyUsed(match.time);
      const energyCost = parseFloat(calculateEnergyCost(energyUsed));
      const baseProfit = bftValue + flexValue - energyCost;

      const bonusMultiplier = match.build?.bonusMultiplier || 1.0;
      const perksMultiplier = match.build?.perksMultiplier || 1.0;

      return (baseProfit * bonusMultiplier * perksMultiplier).toFixed(2);
    },
    [
      calculateTokenValue,
      calculatePremiumValue,
      calculateEnergyUsed,
      calculateEnergyCost,
    ]
  );

  const calculateMatchMetrics = useCallback(
    (match) => {
      if (!match) return null;

      const energyUsed = calculateEnergyUsed(match.time);
      const luckrate = calculateLuckrate(match.badge_used || []);

      return {
        ...match,
        energyUsed,
        luckrate,
        calculated: {
          energyCost: calculateEnergyCost(energyUsed),
          tokenValue: calculateTokenValue(match.totalToken),
          premiumValue: calculatePremiumValue(match.totalPremiumCurrency),
          profit: calculateProfit(match),
        },
      };
    },
    [
      calculateEnergyUsed,
      calculateLuckrate,
      calculateEnergyCost,
      calculateTokenValue,
      calculatePremiumValue,
      calculateProfit,
    ]
  );

  return {
    calculateEnergyUsed,
    calculateEnergyCost,
    calculateTokenValue,
    calculatePremiumValue,
    calculateLuckrate,
    calculateProfit,
    calculateMatchMetrics,
  };
};
