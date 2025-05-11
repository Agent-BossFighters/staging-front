import { useState, useCallback } from "react";
import { getData, getMonthlyData } from "@utils/api/data";

export const useMonthlyData = () => {
  const [state, setState] = useState({
    monthlyTotals: null,
    dailyMetrics: {},
    loading: false,
    error: null,
    selectedDate: new Date(),
  });

  const fetchMonthlyData = useCallback(async (date) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // S'assurer que le mois est sur 2 chiffres
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const formattedDate = `${year}-${month}`;

      // Utilisation de la fonction spécialisée pour les données mensuelles
      const [summaryResponse, matchesResponse] = await Promise.all([
        getMonthlyData(`v1/matches/monthly_summary/${formattedDate}`),
        getMonthlyData(`v1/matches/monthly/${formattedDate}`)
      ]);

      // Traiter les données journalières
      const dailyMetrics = {};
      if (matchesResponse?.matches) {
        Object.entries(matchesResponse.matches).forEach(([date, dayData]) => {
          dailyMetrics[date] = {
            matches: dayData.matches,
            total_matches: dayData.total_matches,
            total_energy: dayData.total_energy,
            total_bft: dayData.total_bft.amount,
            total_flex: dayData.total_flex.amount,
            wins: dayData.results.win,
            losses: dayData.results.loss,
            draws: dayData.results.draw,
            total_energy_cost: dayData.total_energy_cost,
            total_bft_value: dayData.total_bft.value,
            total_flex_value: dayData.total_flex.value,
            total_profit: dayData.profit,
            win_rate: dayData.win_rate,
          };
        });
      }

      // Traiter le résumé mensuel
      const monthlyTotals = summaryResponse?.summary ? {
        total_matches: summaryResponse.summary.matchesCount,
        total_energy: summaryResponse.summary.energyUsed.amount,
        total_energy_cost: summaryResponse.summary.energyUsed.cost,
        total_bft: summaryResponse.summary.totalBft.amount,
        total_bft_value: summaryResponse.summary.totalBft.value,
        total_flex: summaryResponse.summary.totalFlex.amount,
        total_flex_value: summaryResponse.summary.totalFlex.value,
        profit: summaryResponse.summary.profit,
        total_wins: summaryResponse.summary.results.win,
        total_losses: summaryResponse.summary.results.loss,
        total_draws: summaryResponse.summary.results.draw,
        win_rate: summaryResponse.summary.winRate,
      } : null;

      setState((prev) => ({
        ...prev,
        dailyMetrics,
        monthlyTotals,
        loading: false,
        selectedDate: date,
      }));
    } catch (error) {
      console.error("❌ Error fetching monthly data:", error);
      
      // Message d'erreur spécifique pour les timeouts
      let errorMessage = error.message;
      if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
        errorMessage = `Le chargement des données mensuelles a pris trop de temps. Veuillez réessayer ou sélectionner une période plus courte.`;
      }
      
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
    }
  }, []);

  return {
    ...state,
    fetchMonthlyData,
  };
}; 