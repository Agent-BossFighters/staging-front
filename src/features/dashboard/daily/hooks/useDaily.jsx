import { useState, useEffect } from "react";
import { useMatchOperations } from "./useMatchOperations";
import { useMatchCalculations } from "./useMatchCalculations";
import { useRarityManagement } from "./useRarityManagement";
import { getData } from "@utils/api/data";

export const useDaily = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [builds, setBuilds] = useState([]);
  const matchOps = useMatchOperations();
  const calculations = useMatchCalculations();
  const rarityManager = useRarityManagement();

  const fetchBuilds = async () => {
    try {
      const response = await getData("v1/user_builds");
      if (response?.builds) {
        setBuilds(response.builds);
      }
    } catch (error) {
      console.error("Error fetching builds:", error);
      setBuilds([]);
    }
  };

  const initializeData = async () => {
    await Promise.all([
      fetchBuilds(),
      matchOps.fetchMatches(selectedDate.toISOString().split("T")[0]),
    ]);
  };

  useEffect(() => {
    initializeData();
  }, [selectedDate]);

  const calculateDailySummary = () => {
    if (!matchOps.matches.length) {
      return {
        matchesCount: 0,
        energyUsed: { amount: 0, cost: "$0.00" },
        totalBft: { amount: 0, value: "$0.00" },
        totalFlex: { amount: 0, value: "$0.00" },
        profit: "$0.00",
      };
    }

    return matchOps.matches.reduce(
      (acc, match) => {
        const energyUsed = calculations.calculateEnergyUsed(match.time);
        const energyCost = calculations.calculateEnergyCost(energyUsed);
        const bftValue = calculations.calculateTokenValue(match.totalToken);
        const flexValue = calculations.calculatePremiumValue(
          match.totalPremiumCurrency
        );
        const profit = calculations.calculateProfit(match);

        return {
          matchesCount: matchOps.matches.length,
          energyUsed: {
            amount: acc.energyUsed.amount + parseFloat(energyUsed),
            cost: `$${((acc.energyUsed.amount + parseFloat(energyUsed)) * 1.49).toFixed(2)}`,
          },
          totalBft: {
            amount: acc.totalBft.amount + match.totalToken,
            value: `$${((acc.totalBft.amount + match.totalToken) * 0.01).toFixed(2)}`,
          },
          totalFlex: {
            amount: acc.totalFlex.amount + match.totalPremiumCurrency,
            value: `$${((acc.totalFlex.amount + match.totalPremiumCurrency) * 0.00744).toFixed(2)}`,
          },
          profit: `$${(parseFloat(acc.profit.replace("$", "")) + parseFloat(profit)).toFixed(2)}`,
        };
      },
      {
        matchesCount: 0,
        energyUsed: { amount: 0, cost: "$0.00" },
        totalBft: { amount: 0, value: "$0.00" },
        totalFlex: { amount: 0, value: "$0.00" },
        profit: "$0.00",
      }
    );
  };

  return {
    ...matchOps,
    ...calculations,
    ...rarityManager,
    builds,
    selectedDate,
    setSelectedDate,
    dailySummary: calculateDailySummary(),
    initializeData,
  };
};
