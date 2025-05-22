import { useState } from 'react';
import { kyInstance } from '@utils/api/ky-config';
import { findRandomAvailableTeam } from '../utils/findRandomAvailableTeam';
import toast from 'react-hot-toast';

export const useTournamentActions = () => {
  const [isJoining, setIsJoining] = useState(false);

  const joinRandomTeam = async (tournament, teams, user, entryCode = null) => {
    if (!user) {
      toast.error("You must be logged in to join a team");
      return;
    }

    setIsJoining(true);
    try {
      // Trouver une équipe aléatoire disponible
      const randomTeam = findRandomAvailableTeam(teams, tournament);

      if (!randomTeam) {
        toast.error("No available teams found");
        return;
      }

      // Si le tournoi nécessite un code d'entrée
      if (tournament.entry_code && !entryCode) {
        // Demander le code d'entrée à l'utilisateur
        const code = prompt("Please enter the tournament code:");
        if (!code) {
          toast.error("Entry code is required");
          return null;
        }
        entryCode = code;
      }

      // Rejoindre l'équipe sélectionnée
      await kyInstance.post(`v1/tournaments/${tournament.id}/teams/${randomTeam.id}/join`, {
        json: entryCode ? { entry_code: entryCode } : undefined
      }).json();

      toast.success(`Successfully joined team ${randomTeam.name}!`);
      return randomTeam;
    } catch (error) {
      console.error('Error joining random team:', error);
      const errorMessage = error.response?.data?.error ||
        (error.response?.status === 422 ? `Failed to join team. Please check your agent level, minimum required is ${tournament.agent_level_required}. Or check tournament/team entry code.` :
          error.message || "Failed to join team");
      toast.error(errorMessage);
      return null;
    } finally {
      setIsJoining(false);
    }
  };

  return {
    joinRandomTeam,
    isJoining
  };
}; 