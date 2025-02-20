import { useState } from "react";
import { getData, postData, putData, deleteData } from "@utils/api/data";

export const useDaily = () => {
  const [matches, setMatches] = useState([]);
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchDailyMetrics = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getData(`/v1/daily_metrics/${date}`);
      if (response?.metrics) {
        setMatches(response.metrics.matches || []);
      }
    } catch (error) {
      console.error("Error fetching daily metrics:", error);
      let errorMessage = error.message;
      try {
        const parsedError = JSON.parse(error.message);
        if (parsedError.exception && parsedError.exception.includes("badge_useds.nft_id")) {
          errorMessage = "Une erreur de base de données est survenue. Veuillez contacter l'équipe technique (Erreur: Incompatibilité de nommage de colonne dans badge_useds).";
        }
      } catch (e) {
        // If parsing fails, keep the original error message
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBuilds = async () => {
    try {
      const payload = await getData("/v1/user_builds");
      if (payload && payload.builds) {
        setBuilds(payload.builds);
      } else {
        setBuilds([]);
      }
    } catch (error) {
      console.error("Error fetching builds:", error);
      setBuilds([]);
    }
  };

  const addMatch = async (matchData) => {
    try {
      const response = await postData('/v1/matches', { match: matchData });
      if (response?.daily_metrics?.matches) {
        setMatches(response.daily_metrics.matches);
      }
      return response;
    } catch (error) {
      console.error("Error adding match:", error);
      throw error;
    }
  };

  const updateMatch = async (id, matchData) => {
    try {
      const response = await putData(`/v1/matches/${id}`, { match: matchData });
      if (response?.daily_metrics?.matches) {
        setMatches(response.daily_metrics.matches);
      }
      return response;
    } catch (error) {
      console.error("Error updating match:", error);
      throw error;
    }
  };

  const deleteMatch = async (id) => {
    try {
      const response = await deleteData(`/v1/matches/${id}`);
      if (response?.daily_metrics?.matches) {
        setMatches(response.daily_metrics.matches);
      }
      return response;
    } catch (error) {
      console.error("Error deleting match:", error);
      throw error;
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

    const summary = matches.reduce((acc, match) => {
      // Convertir explicitement en nombres
      const energyAmount = Number(match.energy?.used) || 0;
      const energyCost = Number(match.energy?.cost) || 0;
      const bftAmount = Number(match.rewards?.bft?.amount) || 0;
      const bftValue = Number(match.rewards?.bft?.value) || 0;
      const flexAmount = Number(match.rewards?.flex?.amount) || 0;
      const flexValue = Number(match.rewards?.flex?.value) || 0;
      const matchProfit = Number(match.rewards?.profit) || 0;

      return {
        matchesCount: matches.length,
        energyUsed: {
          amount: acc.energyUsed.amount + energyAmount,
          cost: acc.energyUsed.cost + energyCost
        },
        totalBft: {
          amount: acc.totalBft.amount + bftAmount,
          value: acc.totalBft.value + bftValue
        },
        totalFlex: {
          amount: acc.totalFlex.amount + flexAmount,
          value: acc.totalFlex.value + flexValue
        },
        profit: acc.profit + matchProfit
      };
    }, {
      matchesCount: 0,
      energyUsed: { amount: 0, cost: 0 },
      totalBft: { amount: 0, value: 0 },
      totalFlex: { amount: 0, value: 0 },
      profit: 0
    });

    // Format les valeurs monétaires en s'assurant qu'elles sont des nombres
    return {
      ...summary,
      energyUsed: {
        amount: summary.energyUsed.amount,
        cost: `$${Number(summary.energyUsed.cost).toFixed(2)}`
      },
      totalBft: {
        amount: summary.totalBft.amount,
        value: `$${Number(summary.totalBft.value).toFixed(2)}`
      },
      totalFlex: {
        amount: summary.totalFlex.amount,
        value: `$${Number(summary.totalFlex.value).toFixed(2)}`
      },
      profit: `$${Number(summary.profit).toFixed(2)}`
    };
  };

  return {
    matches,
    builds,
    loading,
    error,
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