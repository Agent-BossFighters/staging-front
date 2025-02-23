import { useState, useEffect, useCallback } from "react";
import { getData, postData, putData, deleteData } from "@utils/api/data";
import { useMatchCalculations } from "./useMatchCalculations";
import { toast } from "react-hot-toast";

const DAILY_RARITIES_KEY = "daily_rarities_";

const DailyRaritiesCache = {
  getKey: (date) => `${DAILY_RARITIES_KEY}${date}`,
  
  set: (date, matchId, rarities) => {
    const key = DailyRaritiesCache.getKey(date);
    const cached = localStorage.getItem(key);
    const data = cached ? JSON.parse(cached) : {};
    data[matchId] = rarities;
    localStorage.setItem(key, JSON.stringify(data));
  },

  get: (date, matchId) => {
    const key = DailyRaritiesCache.getKey(date);
    const cached = localStorage.getItem(key);
    if (!cached) return Array(5).fill("rare");
    const data = JSON.parse(cached);
    return data[matchId] || Array(5).fill("rare");
  },

  clear: () => {
    const today = new Date().toISOString().split("T")[0];
    Object.keys(localStorage)
      .filter(key => key.startsWith(DAILY_RARITIES_KEY) && !key.includes(today))
      .forEach(key => localStorage.removeItem(key));
  },

  remove: (date, matchId) => {
    const key = DailyRaritiesCache.getKey(date);
    const cached = localStorage.getItem(key);
    if (cached) {
      const data = JSON.parse(cached);
      delete data[matchId];
      localStorage.setItem(key, JSON.stringify(data));
    }
  }
};

export const useDaily = () => {
  const [matches, setMatches] = useState([]);
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const { calculateMatchMetrics, calculateEnergyUsed } = useMatchCalculations();

  useEffect(() => {
    DailyRaritiesCache.clear();
  }, []);

  const handleError = (message, error) => {
    toast.error(message);
    console.error(error);
  };

  const fetchDailyMetrics = useCallback(async (date) => {
    try {
      const response = await getData(`v1/daily_metrics/${date}`);
      const enrichedMatches = response.matches.map(match => ({
        ...match,
        selectedRarities: match.selectedRarities || []
      }));
      setMatches(enrichedMatches);
    } catch (error) {
      handleError("Erreur lors du chargement des métriques journalières", error);
    }
  }, []);

  const fetchMyBuilds = useCallback(async () => {
    try {
      const response = await getData("v1/user_builds");
      setBuilds(response?.builds || []);
    } catch (error) {
      handleError("Erreur lors du chargement des builds", error);
      setBuilds([]);
    }
  }, []);

  const initializeData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchMyBuilds(), fetchDailyMetrics(selectedDate)]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, fetchMyBuilds, fetchDailyMetrics]);

  const handleAddMatch = useCallback(async (matchData) => {
    try {
      const response = await postData("v1/matches", matchData);
      const newMatch = {
        ...response.match,
        selectedRarities: matchData.selectedRarities
      };
      setMatches(prev => [...prev, newMatch]);
      await fetchDailyMetrics(selectedDate);
      toast.success("Match ajouté avec succès");
      return newMatch;
    } catch (error) {
      handleError("Erreur lors de l'ajout du match", error);
    }
  }, [selectedDate, fetchDailyMetrics]);

  const handleUpdateMatch = useCallback(async (id, matchData) => {
    try {
      const response = await putData(`v1/matches/${id}`, matchData);
      const updatedMatch = {
        ...response.match,
        selectedRarities: matchData.selectedRarities
      };
      setMatches(prev => prev.map(match => match.id === id ? updatedMatch : match));
      toast.success("Match mis à jour avec succès");
      return updatedMatch;
    } catch (error) {
      handleError("Erreur lors de la mise à jour du match", error);
    }
  }, []);

  const handleDeleteMatch = useCallback(async (id) => {
    try {
      await deleteData(`v1/matches/${id}`);
      const matchToDelete = matches.find(m => m.id === id);
      if (matchToDelete) {
        DailyRaritiesCache.remove(matchToDelete.date.split("T")[0], id);
      }
      setMatches(prev => prev.filter(match => match.id !== id));
      await fetchDailyMetrics(selectedDate);
      toast.success("Match supprimé avec succès");
    } catch (error) {
      handleError("Erreur lors de la suppression du match", error);
    }
  }, [matches, selectedDate, fetchDailyMetrics]);

  const calculateDailySummary = useCallback(() => {
    if (!matches.length) {
      return {
        matchesCount: 0,
        energyUsed: { amount: 0, cost: "$0.00" },
        totalBft: { amount: 0, value: "$0.00" },
        totalFlex: { amount: 0, value: "$0.00" },
        profit: "$0.00"
      };
    }

    return matches.reduce((acc, match) => {
      const metrics = calculateMatchMetrics(match);
      const energyUsed = calculateEnergyUsed(match.time);

      return {
        matchesCount: matches.length,
        energyUsed: {
          amount: acc.energyUsed.amount + energyUsed,
          cost: `$${((acc.energyUsed.amount + energyUsed) * 1.49).toFixed(2)}`
        },
        totalBft: {
          amount: acc.totalBft.amount + match.totalToken,
          value: `$${((acc.totalBft.amount + match.totalToken) * 0.01).toFixed(2)}`
        },
        totalFlex: {
          amount: acc.totalFlex.amount + match.totalPremiumCurrency,
          value: `$${((acc.totalFlex.amount + match.totalPremiumCurrency) * 0.00744).toFixed(2)}`
        },
        profit: `$${(acc.profit.replace("$", "") * 1 + parseFloat(metrics.calculated.profit)).toFixed(2)}`
      };
    }, {
      matchesCount: 0,
      energyUsed: { amount: 0, cost: "$0.00" },
      totalBft: { amount: 0, value: "$0.00" },
      totalFlex: { amount: 0, value: "$0.00" },
      profit: "$0.00"
    });
  }, [matches, calculateMatchMetrics, calculateEnergyUsed]);

  return {
    matches,
    builds,
    loading,
    selectedDate,
    setSelectedDate,
    initializeData,
    handleAddMatch,
    handleUpdateMatch,
    handleDeleteMatch,
    dailySummary: calculateDailySummary()
  };
};
