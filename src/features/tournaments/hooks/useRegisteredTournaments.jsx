import { useState, useEffect } from "react";
import { kyInstance } from "@utils/api/ky-config";

/**
 * Hook pour récupérer les tournois auxquels l'utilisateur est inscrit
 * @returns {Object} - Tournois auxquels l'utilisateur est inscrit, état de chargement, erreur et fonction pour actualiser
 */
export function useRegisteredTournaments() {
  const [registeredTournaments, setRegisteredTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRegisteredTournaments = async () => {
    setIsLoading(true);
    
    try {
      // Utiliser l'endpoint spécifique pour les tournois de l'utilisateur
      const response = await kyInstance.get('v1/tournaments/my_tournaments').json();
      
      let tournamentList = [];
      if (response.tournaments && Array.isArray(response.tournaments)) {
        tournamentList = response.tournaments;
      } else if (Array.isArray(response)) {
        // Au cas où la réponse serait directement un tableau
        tournamentList = response;
      }
      
      setRegisteredTournaments(tournamentList);
      setError(null);
    } catch (err) {
      console.error("Error fetching registered tournaments:", err);
      setRegisteredTournaments([]);
      setError("Failed to load your registered tournaments: " + (err.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisteredTournaments();
  }, []);

  return { registeredTournaments, isLoading, error, refetch: fetchRegisteredTournaments };
}