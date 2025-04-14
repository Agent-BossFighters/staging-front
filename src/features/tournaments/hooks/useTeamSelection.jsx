import { useState, useEffect } from "react";
import { getAvailableSlots } from "../utils";

/**
 * Hook pour gérer la sélection d'équipe et de slot dans un tournoi
 * @param {Object} tournament - Le tournoi concerné 
 * @returns {Object} - États et fonctions pour la sélection d'équipe et de slot
 */
export function useTeamSelection(tournament) {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [entryCode, setEntryCode] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isPrivateTeam, setIsPrivateTeam] = useState(false);
  
  // Réinitialiser la sélection lorsqu'on change d'équipe
  useEffect(() => {
    if (selectedTeam) {
      const availableSlots = getAvailableSlots(selectedTeam, tournament);
      if (availableSlots.length > 0) {
        setSelectedSlot(availableSlots[0]);
      } else {
        setSelectedSlot(null);
      }
    } else {
      setSelectedSlot(null);
    }
    setInvitationCode("");
  }, [selectedTeam, tournament]);
  
  // Gérer la privatisation de l'équipe (pour le premier joueur)
  const handleTogglePrivate = () => {
    setIsPrivateTeam(!isPrivateTeam);
  };
  
  return {
    selectedTeam,
    setSelectedTeam,
    entryCode,
    setEntryCode,
    invitationCode,
    setInvitationCode,
    selectedSlot,
    setSelectedSlot,
    isPrivateTeam,
    handleTogglePrivate
  };
} 