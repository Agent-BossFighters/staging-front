import { useState, useEffect } from "react";
import { kyInstance } from "@utils/api/ky-config";
import { useAuth } from "@context/auth.context";

/**
 * Hook pour charger les données des équipes d'un tournoi
 * @param {Object} tournament - Le tournoi concerné
 * @param {Boolean} isOpen - Si la modale est ouverte
 * @param {Function} setError - Fonction pour définir les erreurs
 * @returns {Object} - Données des équipes et fonctions associées
 */
export function useTournamentTeamsData(tournament, isOpen, setError) {
  const [teams, setTeams] = useState([]);
  const [emptyTeams, setEmptyTeams] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const { user } = useAuth();
  
  // Vérifie si l'utilisateur est le créateur du tournoi
  const isCreator = user && tournament.creator_id === user.id;
  
  // Générer la structure des équipes vides
  useEffect(() => {
    const generateEmptyTeams = () => {
      const maxTeams = tournament.max_teams || 8;
      const result = [];
      
      for (let i = 0; i < maxTeams; i++) {
        const letter = String.fromCharCode(65 + i);
        result.push({
          id: `empty-${i}`,
          name: `Team ${letter}`,
          isEmpty: true,
          team_index: i,
          letter: letter
        });
      }
      
      return result;
    };
    
    if (isOpen) {
      setEmptyTeams(generateEmptyTeams());
    }
  }, [isOpen, tournament.max_teams]);
  
  // Charger la liste des équipes
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // Récupérer les équipes du tournoi
        const response = await kyInstance.get(`v1/tournaments/${tournament.id}/teams`).json();
        const teamsData = response.teams || [];
        
        // S'assurer que toutes les équipes ont un team_index valide, 
        // en assignant 0 à l'équipe A si elle a un index undefined
        const teamsWithValidIndex = teamsData.map(team => {
          // Si le nom de l'équipe est "Team A" et que l'index est undefined, assigner 0
          if (team.name === "Team A" && (team.team_index === undefined || team.team_index === null)) {
            return { ...team, team_index: 0 };
          }
          
          // Garantir que toutes les équipes ont un index (même si ce n'est pas le bon)
          if (team.team_index === undefined || team.team_index === null) {
            // Essayer de déduire l'index à partir du nom si c'est un "Team X"
            const match = team.name.match(/Team ([A-Z])/);
            if (match && match[1]) {
              const letter = match[1];
              const deducedIndex = letter.charCodeAt(0) - 65; // A=0, B=1, etc.
              return { ...team, team_index: deducedIndex };
            }
            return { ...team, team_index: 0 }; // Fallback
          }
          return team;
        });
        
        // Map team indexes to letters and ensure team_index is preserved
        const teamsWithLetters = teamsWithValidIndex.map(team => ({
          ...team,
          letter: String.fromCharCode(65 + team.team_index),
          isExisting: true // Marquer comme équipe existante
        }));
        
        // Trier les équipes par team_index pour garantir l'ordre correct
        teamsWithLetters.sort((a, b) => a.team_index - b.team_index);
        
        setTeams(teamsWithLetters);
        
        // Vérifier si l'utilisateur est déjà dans une équipe
        const userTeamsArr = teamsWithLetters.filter(team => {
          const members = team.team_members || team.players || [];
          return members.some(member => {
            const userId = member.user_id || (member.user && member.user.id);
            return userId === user.id;
          });
        });
        
        setUserTeams(userTeamsArr);
        
        if (userTeamsArr.length > 0) {
          setError(`You are already a member of team ${userTeamsArr[0].name} in this tournament.`);
        } else {
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };
    
    if (isOpen && !isCreator && user) {
      fetchTeams();
    }
  }, [isOpen, tournament.id, isCreator, user, setError]);
  
  // Vérifier si l'utilisateur est le créateur
  useEffect(() => {
    if (isCreator) {
      setError("As the tournament creator, you cannot participate as a player.");
    }
  }, [isCreator, setError]);
  
  return {
    teams,
    emptyTeams,
    userTeams,
    isCreator
  };
} 