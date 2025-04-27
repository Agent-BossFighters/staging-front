import { useState, useEffect } from "react";
import { kyInstance } from "@utils/api/ky-config";

/**
 * Hook pour récupérer les matchs d'un tournoi
 * @param {string|number} tournamentId - ID du tournoi
 * @returns {Object} - Matchs, état de chargement, erreur et fonction pour actualiser
 */
export function useTournamentMatches(tournamentId) {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = async () => {
    setIsLoading(true);
    
    try {
      const response = await kyInstance.get(`v1/tournaments/${tournamentId}/tournament_matches`).json();
      setMatches(response.matches);
      setError(null);
    } catch (err) {
      setError(err);
      setMatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!tournamentId) return;
    fetchMatches();
  }, [tournamentId]);

  return { matches, isLoading, error, refetch: fetchMatches };
} 