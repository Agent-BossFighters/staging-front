import { useState, useCallback, useEffect } from "react";
import { useMatchOperations } from "./useMatchOperations";
import { getData } from "@utils/api/data";

export const useDaily = () => {
  const [builds, setBuilds] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);
  const matchOps = useMatchOperations();

  const fetchBuilds = useCallback(async () => {
    const response = await getData("v1/user_builds");
    if (response?.builds) {
      setBuilds(response.builds);
    }
  }, []);

  const fetchDailySummary = useCallback(async (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const response = await getData(`v1/summaries/daily/${formattedDate}`);
    if (response) {
      setDailySummary(response);
    } else {
      setDailySummary({
        matchesCount: 0,
        energyUsed: { amount: 0, cost: 0 },
        totalBft: { amount: 0, value: 0 },
        totalFlex: { amount: 0, value: 0 },
        profit: 0,
        results: { win: 0, loss: 0, draw: 0 },
      });
    }
  }, []);

  // Charger les builds une seule fois au montage
  useEffect(() => {
    fetchBuilds();
  }, []);

  // Charger les données quotidiennes uniquement quand la date change
  useEffect(() => {
    if (matchOps.selectedDate) {
      fetchDailySummary(matchOps.selectedDate);
      matchOps.fetchMatches(matchOps.selectedDate);
    }
  }, [matchOps.selectedDate]);

  return {
    ...matchOps,
    builds,
    dailySummary: dailySummary || {
      matchesCount: 0,
      energyUsed: { amount: 0, cost: 0 },
      totalBft: { amount: 0, value: 0 },
      totalFlex: { amount: 0, value: 0 },
      profit: 0,
      results: { win: 0, loss: 0, draw: 0 },
    },
  };
};
