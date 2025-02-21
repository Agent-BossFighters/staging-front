import { useState } from "react";
import { getData, postData, putData, deleteData } from "@utils/api/data";
import { useMatchCalculations } from "./useMatchCalculations";

export const useDaily = () => {
  const [matches, setMatches] = useState([]);
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { calculateMatchMetrics } = useMatchCalculations();

  const fetchDailyMetrics = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getData(`/v1/daily_metrics/${date}`);
      if (response?.metrics?.matches) {
        // Enrichir les matches avec les calculs
        const calculatedMatches = response.metrics.matches.map(match => calculateMatchMetrics(match));
        setMatches(calculatedMatches);
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
      // Calcul immédiat pour l'UI
      const calculatedMatch = calculateMatchMetrics(matchData);
      
      // Mise à jour optimiste de l'UI
      setMatches(prev => [...prev, calculatedMatch]);

      const response = await postData('/v1/matches', { match: matchData });
      
      if (response?.daily_metrics?.matches) {
        const calculatedMatches = response.daily_metrics.matches.map(match => calculateMatchMetrics(match));
        setMatches(calculatedMatches);
      }
      return response;
    } catch (error) {
      console.error("Error adding match:", error);
      throw error;
    }
  };

  const updateMatch = async (id, matchData) => {
    try {
      // Calcul immédiat pour l'UI
      const calculatedMatch = calculateMatchMetrics(matchData);
      
      // Mise à jour optimiste de l'UI
      setMatches(prev => prev.map(match => 
        match.id === id ? calculatedMatch : match
      ));

      const response = await putData(`/v1/matches/${id}`, { match: matchData });
      
      if (response?.daily_metrics?.matches) {
        const calculatedMatches = response.daily_metrics.matches.map(match => calculateMatchMetrics(match));
        setMatches(calculatedMatches);
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
        const calculatedMatches = response.daily_metrics.matches.map(match => calculateMatchMetrics(match));
        setMatches(calculatedMatches);
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

    return matches.reduce((acc, match) => {
      const calculated = match.calculated || {};
      
      return {
        matchesCount: matches.length,
        energyUsed: {
          amount: acc.energyUsed.amount + Number(match.energyUsed || 0),
          cost: `$${(acc.energyUsed.cost.replace('$', '') * 1 + Number(calculated.energyCost || 0)).toFixed(2)}`
        },
        totalBft: {
          amount: acc.totalBft.amount + Number(match.totalToken || 0),
          value: `$${(acc.totalBft.value.replace('$', '') * 1 + Number(calculated.tokenValue || 0)).toFixed(2)}`
        },
        totalFlex: {
          amount: acc.totalFlex.amount + Number(match.totalPremiumCurrency || 0),
          value: `$${(acc.totalFlex.value.replace('$', '') * 1 + Number(calculated.premiumValue || 0)).toFixed(2)}`
        },
        profit: `$${(acc.profit.replace('$', '') * 1 + Number(calculated.profit || 0)).toFixed(2)}`
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