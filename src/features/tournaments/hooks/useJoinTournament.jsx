import { useState } from "react";
import { kyInstance } from "@utils/api/ky-config";
import toast from "react-hot-toast";
import { getDisplayTeams } from "../utils";

/**
 * Hook pour gérer la jointure d'un tournoi
 * @param {Object} tournament - Le tournoi à rejoindre
 * @param {Array} teams - Équipes du tournoi
 * @param {Function} onClose - Fonction pour fermer la modale
 * @returns {Object} - États et fonctions pour gérer la jointure
 */
export function useJoinTournament(tournament, teams, onClose) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Fonction pour rejoindre une équipe du tournoi
   * @param {Object} selectedTeam - Équipe sélectionnée
   * @param {Number} selectedSlot - Slot sélectionné
   * @param {String} entryCode - Code d'entrée du tournoi
   * @param {String} invitationCode - Code d'invitation de l'équipe
   * @param {Boolean} isPrivateTeam - Si l'équipe doit être privée
   */
  const joinTournament = async (selectedTeam, selectedSlot, entryCode, invitationCode, isPrivateTeam) => {
    setIsLoading(true);
    setError(null);
    
    if (!selectedTeam) {
      setError("Please select a team first");
      setIsLoading(false);
      return;
    }
    
    if (selectedSlot === null) {
      setError("Please select an available slot");
      setIsLoading(false);
      return;
    }
    
    try {
      // Vérifier que nous avons un ID d'équipe valide
      if (!selectedTeam.id) {
        setError("Team ID is missing");
        setIsLoading(false);
        return;
      }
      
      // Convertir en chaîne pour la vérification
      const teamId = String(selectedTeam.id);
      const teamIndex = selectedTeam.team_index;
      
      // Vérifier si c'est un placeholder ID
      if (teamId.startsWith('empty-')) {
        // Vérifier si une équipe réelle existe déjà pour cette position
        const letter = selectedTeam.letter || String.fromCharCode(65 + teamIndex);
        
        const realTeam = teams.find(t => 
          t.id && !String(t.id).startsWith('empty-') && 
          (t.letter === letter || t.team_index === teamIndex)
        );
        
        if (realTeam) {
          // Une équipe réelle existe, on la rejoint
          
          // Préparer les données
          const joinData = {
            slot_number: selectedSlot,
            private: isPrivateTeam
          };
          
          // Si l'équipe a un code d'invitation, vérifier qu'un code a été saisi
          if (realTeam.invitation_code) {
            if (!invitationCode) {
              setError("This team is private and requires an invitation code");
              setIsLoading(false);
              return;
            }
            joinData.invitation_code = invitationCode;
          }
          
          // Si le tournoi a un code d'entrée, l'ajouter
          if (tournament.entry_code) {
            joinData.entry_code = entryCode;
          }
          
          // Appel API pour rejoindre l'équipe existante
          await kyInstance.post(`v1/tournaments/${tournament.id}/teams/${realTeam.id}/join`, {
            json: joinData
          }).json();
        } else {
          // Aucune équipe réelle n'existe pour cette lettre, on en crée une nouvelle
          
          // Récupérer l'index visuel de l'équipe (position dans l'affichage)
          // Cet index sera utilisé pour déterminer la lettre (A, B, C...)
          const visualTeamsArray = getDisplayTeams(teams, tournament);
          const visualIndex = visualTeamsArray.findIndex(t => t.id === selectedTeam.id);
          
          // Créer une nouvelle équipe en préservant les informations importantes
          const createTeamData = {
            name: selectedTeam.name, // Conserver le nom affiché dans l'UI
            private: isPrivateTeam,
            team_index: visualIndex // Utiliser l'index visuel pour conserver l'ordre d'affichage
          };
          
          // Si le tournoi a un code d'entrée, l'ajouter
          if (tournament.entry_code) {
            createTeamData.entry_code = entryCode;
          }
          
          try {
            // Créer l'équipe d'abord
            const createResponse = await kyInstance.post(`v1/tournaments/${tournament.id}/teams`, {
              json: createTeamData
            }).json();
            
            // Puis rejoindre l'équipe nouvellement créée
            const newTeamId = createResponse.id || createResponse.team?.id;
            
            if (!newTeamId) {
              throw new Error("Failed to get ID of newly created team");
            }
            
            const joinData = {
              slot_number: selectedSlot,
              private: isPrivateTeam
            };
            
            await kyInstance.post(`v1/tournaments/${tournament.id}/teams/${newTeamId}/join`, {
              json: joinData
            }).json();
          } catch (createErr) {
            throw createErr;
          }
        }
      } else {
        // Cas d'une équipe existante
        
        // Simplifier les données pour n'envoyer que le numéro du slot
        const joinData = {
          slot_number: selectedSlot,
          private: isPrivateTeam
        };
        
        // Si l'équipe a un code d'invitation, vérifier qu'un code a été saisi
        if (selectedTeam.invitation_code) {
          if (!invitationCode) {
            setError("This team is private and requires an invitation code");
            setIsLoading(false);
            return;
          }
          joinData.invitation_code = invitationCode;
        }
        
        // Si le tournoi a un code d'entrée, l'ajouter
        if (tournament.entry_code) {
          joinData.entry_code = entryCode;
        }
        
        // Appel API avec l'ID réel de l'équipe dans l'URL
        await kyInstance.post(`v1/tournaments/${tournament.id}/teams/${selectedTeam.id}/join`, {
          json: joinData
        }).json();
      }
      
      // Récupérer les détails mis à jour de l'équipe après la jointure
      try {
        // Récupérer toutes les équipes pour être sûr d'avoir les données à jour
        await kyInstance.get(`v1/tournaments/${tournament.id}/teams`).json();
      } catch (refreshErr) {
        // Ignorer l'erreur de rafraîchissement
      }
      
      // Force le rafraîchissement des données du tournoi avec un délai pour laisser le backend mettre à jour
      toast.success("Joined team successfully!");
      setSuccess(true);
      
      // Utiliser un délai plus long pour le reload pour s'assurer que le backend a eu le temps de mettre à jour
      setTimeout(() => {
        window.location.reload();
      }, 3000); // Passer à 3 secondes pour donner plus de temps au backend
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to join team. Please check the codes.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    success,
    joinTournament,
    setError
  };
} 