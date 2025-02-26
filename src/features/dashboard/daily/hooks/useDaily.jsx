import { useState, useEffect } from "react";
import { useMatchOperations } from "./useMatchOperations";
import { useMatchCalculations } from "./useMatchCalculations";
import { useRarityManagement } from "./useRarityManagement";
import { getData } from "@utils/api/data";

export const useDaily = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const matchOps = useMatchOperations();
  const calculations = useMatchCalculations();
  const rarityManager = useRarityManagement();

  const fetchBuilds = async () => {
    try {
      const response = await getData("v1/user_builds");
      if (response?.builds) {
        setBuilds(response.builds);
      } else {
        setBuilds([]);
      }
    } catch (error) {
      console.error("Error fetching builds:", error);
      setBuilds([]);
    }
  };

  const calculateDailySummary = () => {
    if (!matchOps.matches.length) {
      return {
        matchesCount: 0,
        energyUsed: { amount: 0, cost: "$0.00" },
        totalBft: { amount: 0, value: "$0.00" },
        totalFlex: { amount: 0, value: "$0.00" },
        profit: "$0.00",
        results: {
          win: 0,
          loss: 0,
          draw: 0,
        },
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

        const results = { ...acc.results };
        if (match.result) {
          results[match.result] = (results[match.result] || 0) + 1;
        }

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
          results,
        };
      },
      {
        matchesCount: 0,
        energyUsed: { amount: 0, cost: "$0.00" },
        totalBft: { amount: 0, value: "$0.00" },
        totalFlex: { amount: 0, value: "$0.00" },
        profit: "$0.00",
        results: {
          win: 0,
          loss: 0,
          draw: 0,
        },
      }
    );
  };

  const initializeData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchBuilds(),
        matchOps.fetchMatches(selectedDate.toISOString().split("T")[0]),
      ]);
    } catch (error) {
      console.error("Error initializing data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeData();
  }, [selectedDate]);

  return {
    ...matchOps,
    ...calculations,
    ...rarityManager,
    builds,
    loading,
    selectedDate,
    setSelectedDate,
    dailySummary: calculateDailySummary(),
    initializeData,
  };
};
