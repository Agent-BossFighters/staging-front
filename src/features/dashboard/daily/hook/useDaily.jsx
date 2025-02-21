import { useState } from "react";
import { getData, postData, putData, deleteData } from "@utils/api/data";
import { useMatchCalculations } from "./useMatchCalculations";

export const useDaily = () => {
  const [matches, setMatches] = useState([]);
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { calculateMatchMetrics } = useMatchCalculations();

  const fetchDailyMetrics = async (date) => {
    setLoading(true);
    try {
      const response = await getData(`/v1/daily_metrics/${date}`);
      if (response?.metrics?.matches) {
        setMatches(response.metrics.matches);
      } else {
        setMatches([]);
      }
    } catch (error) {
      console.error("Error fetching daily metrics:", error);
      setMatches([]);
    }
  };

  const fetchMyBuilds = async () => {
    try {
      const response = await getData("/v1/user_builds");
      if (response?.builds) {
        setBuilds(response.builds);
      } else {
        setBuilds([]);
      }
    } catch (error) {
      console.error("Error fetching builds:", error);
      setBuilds([]);
    } finally {
      setLoading(false);
    }
  };

  const addMatch = async (matchData) => {
    try {
      const response = await postData('/v1/matches', { match: matchData });
      if (response?.metrics?.matches) {
        setMatches(response.metrics.matches);
      }
      return response;
    } catch (error) {
      console.error("Error adding match:", error);
      return null;
    }
  };

  const updateMatch = async (id, matchData) => {
    try {
      const response = await putData(`/v1/matches/${id}`, { match: matchData });
      if (response?.metrics?.matches) {
        setMatches(response.metrics.matches);
      }
      return response;
    } catch (error) {
      console.error("Error updating match:", error);
      return null;
    }
  };

  const deleteMatch = async (id) => {
    try {
      const response = await deleteData(`/v1/matches/${id}`);
      if (response?.metrics?.matches) {
        setMatches(response.metrics.matches);
      }
      return response;
    } catch (error) {
      console.error("Error deleting match:", error);
      return null;
    }
  };

  const calculateDailySummary = () => {
    if (!matches.length) return {
      matchesCount: 0,
      energyUsed: { amount: 0, cost: "$0.00" },
      totalBft: { amount: 0, value: "$0.00" },
      totalFlex: { amount: 0, value: "$0.00" },
      profit: "$0.00"
    };

    return matches.reduce((acc, match) => {
      return {
        matchesCount: matches.length,
        energyUsed: {
          amount: acc.energyUsed.amount + Number(match.energyUsed || 0),
          cost: `$${(acc.energyUsed.cost.replace('$', '') * 1 + Number(match.energyCost || 0)).toFixed(2)}`
        },
        totalBft: {
          amount: acc.totalBft.amount + Number(match.totalToken || 0),
          value: `$${(acc.totalBft.value.replace('$', '') * 1 + Number(match.tokenValue || 0)).toFixed(2)}`
        },
        totalFlex: {
          amount: acc.totalFlex.amount + Number(match.totalPremiumCurrency || 0),
          value: `$${(acc.totalFlex.value.replace('$', '') * 1 + Number(match.premiumCurrencyValue || 0)).toFixed(2)}`
        },
        profit: `$${(acc.profit.replace('$', '') * 1 + (
          Number(match.tokenValue || 0) + 
          Number(match.premiumCurrencyValue || 0) - 
          Number(match.energyCost || 0)
        )).toFixed(2)}`
      };
    }, {
      matchesCount: 0,
      energyUsed: { amount: 0, cost: "$0.00" },
      totalBft: { amount: 0, value: "$0.00" },
      totalFlex: { amount: 0, value: "$0.00" },
      profit: "$0.00"
    });
  };

  return {
    matches,
    builds,
    loading,
    selectedDate,
    setSelectedDate,
    fetchDailyMetrics,
    fetchMyBuilds,
    addMatch,
    updateMatch,
    deleteMatch,
    dailySummary: calculateDailySummary()
  };
}; 