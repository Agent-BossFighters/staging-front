import { useState, useEffect } from "react";
import { kyInstance } from "@utils/api/ky-config";

/**
 * Hook pour récupérer les tournois créés par l'utilisateur actuel
 * @param {string|number} userId - ID de l'utilisateur
 * @returns {Object} - Tournois créés, état de chargement, erreur et fonction pour actualiser
 */
export function useMyTournaments(userId) {
  const [myTournaments, setMyTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyTournaments = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    
    try {
      // Récupérer tous les tournois puis filtrer côté client
      const response = await kyInstance.get('v1/tournaments').json();
      
      let tournamentList = [];
      if (response.tournaments && Array.isArray(response.tournaments)) {
        tournamentList = response.tournaments;
      }
      
      // Filtrer uniquement les tournois créés par l'utilisateur actuel
      const createdTournaments = tournamentList.filter(
        tournament => tournament.creator_id === userId
      );
      
      setMyTournaments(createdTournaments);
      setError(null);
    } catch (err) {
      console.error("Error fetching my tournaments:", err);
      setMyTournaments([]);
      setError("Failed to load your tournaments: " + (err.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMyTournaments();
    }
  }, [userId]);

  return { myTournaments, isLoading, error, refetch: fetchMyTournaments };
} 