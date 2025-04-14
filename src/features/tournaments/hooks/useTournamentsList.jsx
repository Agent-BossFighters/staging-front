import { useState, useEffect } from "react";
import { kyInstance } from "@utils/api/ky-config";

/**
 * Hook pour récupérer la liste des tournois avec filtrage
 * @param {Object} filters - Filtres à appliquer (type, status, search, registration)
 * @returns {Object} - Tournois, état de chargement, erreur et fonction pour actualiser
 */
export function useTournamentsList(filters = {}) {
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTournaments = async () => {
    setIsLoading(true);
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.type && filters.type !== "all") {
        queryParams.append("tournament_type", filters.type);
      }
      if (filters.status && filters.status !== "all") {
        queryParams.append("status", filters.status);
      }
      if (filters.search) {
        queryParams.append("search", filters.search);
      }
      // Note: Nous n'envoyons pas le filtre d'inscription au serveur,
      // car nous le gérerons côté client pour une meilleure flexibilité
      
      const response = await kyInstance.get('v1/tournaments', {
        searchParams: queryParams
      }).json();
      
      // Handle different response formats
      let tournamentList = [];
      if (response.tournaments && Array.isArray(response.tournaments)) {
        tournamentList = response.tournaments;
      } 
      
      // Appliquer le filtrage côté client pour l'état d'inscription basé sur les dates
      if (filters.registration && filters.registration !== "all") {
        const now = new Date();
        
        tournamentList = tournamentList.filter(tournament => {
          const startTime = tournament.scheduled_start_time ? new Date(tournament.scheduled_start_time) : null;
          const endTime = tournament.scheduled_end_time ? new Date(tournament.scheduled_end_time) : null;
          
          // Déterminer les différents états
          const isRegistrationOpen = !startTime || now < startTime;
          const isTournamentActive = startTime && now >= startTime && (!endTime || now < endTime);
          const isTournamentEnded = endTime && now >= endTime;
          
          switch (filters.registration) {
            case "open":
              return (tournament.status === "pending" || tournament.status === "draft") && isRegistrationOpen;
            case "closed":
              return (tournament.status === "pending" || tournament.status === "draft") && !isRegistrationOpen;
            case "active":
              return tournament.status === "in_progress" || isTournamentActive;
            case "ended":
              return tournament.status === "completed" || isTournamentEnded;
            default:
              return true;
          }
        });
      }

      setTournaments(tournamentList);
      setError(null);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
      setTournaments([]);
      setError("Failed to load tournaments: " + (err.message || "Unknown error"));
    } finally {
      // Important: ensure isLoading is set to false in all cases
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [filters]);

  return { tournaments, isLoading, error, refetch: fetchTournaments };
} 