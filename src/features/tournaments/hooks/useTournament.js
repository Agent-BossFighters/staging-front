import { useState, useEffect } from "react";
import { kyInstance } from "@utils/api/ky-config";

/**
 * Hook pour récupérer un tournoi spécifique
 * @param {string|number} tournamentId - ID du tournoi à récupérer
 * @returns {Object} - Tournoi, état de chargement et erreur
 */
export function useTournament(tournamentId) {
  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tournamentId) return;

    const fetchTournament = async () => {
      setIsLoading(true);
      
      try {
        const response = await kyInstance.get(`v1/tournaments/${tournamentId}`).json();
        
        // Log details for team management
        if (response && response.tournament) {
          setTournament(response.tournament);
        } else if (response && response.data) {
          setTournament(response.data);
        } else if (response && !response.data && !response.tournament) {
          // If response itself contains the tournament data
          setTournament(response);
        } else {
          setTournament(null);
          setError(new Error("Invalid tournament data format"));
        }
      } catch (err) {
        setError(err);
        setTournament(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournament();
  }, [tournamentId]);

  return { tournament, isLoading, error };
} 