import { useState, useEffect } from "react";
import { kyInstance } from "@utils/api/ky-config";

/**
 * Hook pour récupérer les équipes d'un tournoi
 * @param {string|number} tournamentId - ID du tournoi
 * @returns {Object} - Équipes, état de chargement et erreur
 */
export function useTournamentTeams(tournamentId) {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tournamentId) return;

    const fetchTeams = async () => {
      setIsLoading(true);
      
      try {
        const response = await kyInstance.get(`v1/tournaments/${tournamentId}/teams`).json();
        setTeams(response.teams);
        setError(null);
      } catch (err) {
        setError(err);
        setTeams([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [tournamentId]);

  return { teams, isLoading, error };
} 