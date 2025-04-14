import { useState, useEffect } from "react";
import { kyInstance } from "@utils/api/ky-config";

/**
 * Hook pour récupérer un match spécifique d'un tournoi
 * @param {string|number} tournamentId - ID du tournoi
 * @param {string|number} matchId - ID du match
 * @returns {Object} - Match, état de chargement et erreur
 */
export function useMatch(tournamentId, matchId) {
  const [match, setMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tournamentId || !matchId) return;

    const fetchMatch = async () => {
      setIsLoading(true);
      
      try {
        const response = await kyInstance.get(`v1/tournaments/${tournamentId}/tournament_matches/${matchId}`).json();
        setMatch(response.data || null);
        setError(null);
      } catch (err) {
        console.error(`Error fetching match ${matchId}:`, err);
        setError(err);
        setMatch(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatch();
  }, [tournamentId, matchId]);

  return { match, isLoading, error };
} 