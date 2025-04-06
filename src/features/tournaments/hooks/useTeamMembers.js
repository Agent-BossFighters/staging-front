import { useState, useEffect } from 'react';
import { kyInstance } from "@utils/api/ky-config";

/**
 * Hook personnalisé pour récupérer et normaliser les données des membres d'une équipe
 * 
 * Ce hook résout les problèmes de structure de données incohérentes
 * en normalisant tous les différents formats possibles retournés par l'API.
 */
export function useTeamMembers(tournamentId, teamId) {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [captainId, setCaptainId] = useState(null);
  const [isUserCaptain, setIsUserCaptain] = useState(false);
  
  useEffect(() => {
    if (!tournamentId || !teamId) return;
    
    const fetchTeamData = async () => {
      setIsLoading(true);
      
      try {
        console.log(`[useTeamMembers] Chargement de l'équipe ${teamId} du tournoi ${tournamentId}`);
        const response = await kyInstance.get(`v1/tournaments/${tournamentId}/teams/${teamId}`).json();
        
        // Extraction des données, en tenant compte des différentes structures possibles
        let extractedTeamData = null;
        if (response.data) {
          extractedTeamData = response.data;
        } else if (response.team) {
          extractedTeamData = response.team;
        } else if (response && typeof response === 'object') {
          extractedTeamData = response;
        }
        
        if (!extractedTeamData) {
          throw new Error("Format de réponse API invalide");
        }
        
        // Extraction et normalisation des membres d'équipe
        const rawMembers = extractedTeamData.team_members || [];
        const extractedCaptainId = extractedTeamData.captain_id;
        
        console.log(`[useTeamMembers] Données brutes:`, {
          rawMembers,
          captainId: extractedCaptainId,
          isUserCaptain: extractedTeamData.is_captain
        });
        
        // Normalisation des membres pour avoir une structure cohérente
        const normalizedMembers = rawMembers.map(member => {
          // Extraction des données du joueur (depuis player ou user)
          const playerData = member.player || member.user || {};
          const playerId = playerData.id || member.player_id || member.user_id;
          
          return {
            id: member.id,
            memberId: member.id,
            playerId: playerId,
            username: playerData.username || 'Joueur inconnu',
            level: playerData.level || 1,
            slotNumber: member.slot_number || 0,
            isCaptain: playerId === extractedCaptainId
          };
        });
        
        // Tri par numéro de slot
        normalizedMembers.sort((a, b) => a.slotNumber - b.slotNumber);
        
        console.log(`[useTeamMembers] Membres normalisés:`, normalizedMembers);
        
        setTeamData(extractedTeamData);
        setMembers(normalizedMembers);
        setCaptainId(extractedCaptainId);
        setIsUserCaptain(extractedTeamData.is_captain || false);
        setError(null);
      } catch (err) {
        console.error(`[useTeamMembers] Erreur:`, err);
        setError(err.message || "Impossible de charger les membres de l'équipe");
        setMembers([]);
        setTeamData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTeamData();
  }, [tournamentId, teamId]);
  
  return {
    members,
    teamData,
    captainId,
    isUserCaptain,
    isLoading,
    error
  };
} 