import { useState, useEffect } from "react";
import { getData, postData, putData, deleteData } from "@utils/api/data";
import { useMatchCalculations } from "./useMatchCalculations";

const DAILY_RARITIES_KEY = 'daily_rarities_';

const DailyRaritiesCache = {
  set: (date, matchId, rarities) => {
    const key = `${DAILY_RARITIES_KEY}${date}`;
    const cached = localStorage.getItem(key);
    const data = cached ? JSON.parse(cached) : {};
    
    data[matchId] = rarities;
    localStorage.setItem(key, JSON.stringify(data));
  },

  get: (date, matchId) => {
    const key = `${DAILY_RARITIES_KEY}${date}`;
    const cached = localStorage.getItem(key);
    if (!cached) return Array(5).fill('rare');
    
    const data = JSON.parse(cached);
    return data[matchId] || Array(5).fill('rare');
  },

  clear: () => {
    const today = new Date().toISOString().split('T')[0];
    Object.keys(localStorage)
      .filter(key => key.startsWith(DAILY_RARITIES_KEY) && !key.includes(today))
      .forEach(key => localStorage.removeItem(key));
  }
};

export const useDaily = () => {
  const [matches, setMatches] = useState([]);
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { calculateMatchMetrics } = useMatchCalculations();

  // Nettoyer le cache des jours précédents au montage
  useEffect(() => {
    DailyRaritiesCache.clear();
  }, []);

  const fetchDailyMetrics = async (date) => {
    try {
      setLoading(true);
      const response = await getData(`v1/daily_metrics/${date}`);
      // Garder les raretés telles quelles si elles existent
      const enrichedMatches = response.matches.map(match => ({
        ...match,
        selectedRarities: match.selectedRarities || []
      }));
      setMatches(enrichedMatches);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBuilds = async () => {
    try {
      const response = await getData("v1/user_builds");
      if (response?.builds) {
        setBuilds(response.builds);
        setError(null);
      } else {
        setBuilds([]);
      }
    } catch (error) {
      setBuilds([]);
      setError("Impossible de charger les builds");
    }
  };

  const addMatch = async (matchData) => {
    try {
      const response = await postData('v1/matches', matchData);
      // Utiliser les raretés fournies sans fallback
      const newMatch = {
        ...response.match,
        selectedRarities: matchData.selectedRarities
      };
      setMatches(prev => [...prev, newMatch]);
      return newMatch;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateMatch = async (id, matchData) => {
    try {
      const response = await putData(`v1/matches/${id}`, matchData);
      // Utiliser les raretés fournies sans fallback
      const updatedMatch = {
        ...response.match,
        selectedRarities: matchData.selectedRarities
      };
      setMatches(prev => prev.map(match => 
        match.id === id ? updatedMatch : match
      ));
      return updatedMatch;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteMatch = async (id) => {
    try {
      const matchToDelete = matches.find(m => m.id === id);
      await deleteData(`v1/matches/${id}`);
      
      // Supprimer les raretés du cache
      if (matchToDelete) {
        const key = `${DAILY_RARITIES_KEY}${matchToDelete.date.split('T')[0]}`;
        const cached = localStorage.getItem(key);
        if (cached) {
          const data = JSON.parse(cached);
          delete data[id];
          localStorage.setItem(key, JSON.stringify(data));
        }
      }

      setMatches(currentMatches => 
        currentMatches.filter(match => match.id !== id)
      );
    } catch (error) {
      // Les erreurs sont déjà gérées par data.js
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

    const { calculateEnergyUsed } = useMatchCalculations();

    return matches.reduce((acc, match) => {
      const energyUsed = calculateEnergyUsed(match.time);
      const bftValue = match.totalToken * 0.01;
      const flexValue = match.totalPremiumCurrency * 0.00744;
      const energyCost = energyUsed * 1.49;
      const profit = bftValue + flexValue - energyCost;

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
        profit: `$${(acc.profit.replace('$', '') * 1 + profit).toFixed(2)}`
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