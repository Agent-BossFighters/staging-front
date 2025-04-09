import { useState, useEffect } from "react";
import { kyInstance } from "@utils/api/ky-config";
import { useAuth } from "@context/auth.context";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@shared/ui/card";
import { Switch } from "@shared/ui/switch";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { getTeamColor } from "../constants/uiConfigs";

export default function JoinTournamentModal({ tournament, isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  
  // Form state pour rejoindre une équipe
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [invitationCode, setInvitationCode] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [teams, setTeams] = useState([]);
  const [emptyTeams, setEmptyTeams] = useState([]);
  const [isPrivateTeam, setIsPrivateTeam] = useState(false);
  const [userTeams, setUserTeams] = useState([]);
  
  // Verify if user is the creator of the tournament
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
        
        // Afficher les données brutes pour déboguer
        console.log("===== ORIGINAL TEAMS DATA =====");
        teamsData.forEach(team => {
          console.log(`Original Team ID: ${team.id}, Name: ${team.name}, Index: ${team.team_index !== undefined ? team.team_index : 'undefined'}`);
        });
        
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
              console.log(`Deducing index ${deducedIndex} for ${team.name} from name`);
              return { ...team, team_index: deducedIndex };
            }
            console.log(`Warning: Could not determine index for team ${team.name}`);
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
  }, [isOpen, tournament.id, isCreator, user]);
  
  useEffect(() => {
    if (isCreator) {
      setError("As the tournament creator, you cannot participate as a player.");
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  }, [isCreator, onClose]);
  
  // Réinitialiser la sélection lorsqu'on change d'équipe
  useEffect(() => {
    if (selectedTeam) {
      const availableSlots = getAvailableSlots();
      if (availableSlots.length > 0) {
        setSelectedSlot(availableSlots[0]);
      } else {
        setSelectedSlot(null);
      }
    } else {
      setSelectedSlot(null);
    }
    setInvitationCode("");
  }, [selectedTeam]);
  
  useEffect(() => {
    console.log("===== JOIN MODAL: SELECTION CHANGED =====");
    if (selectedTeam) {
      console.log("Selected team:", {
        id: selectedTeam.id,
        name: selectedTeam.name,
        index: selectedTeam.team_index,
        letter: selectedTeam.letter,
        isEmpty: selectedTeam.isEmpty
      });
      console.log("Available slots:", getAvailableSlots());
    } else {
      console.log("No team selected");
    }
  }, [selectedTeam]);
  
  if (!isOpen) return null;
  
  if (isCreator) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <Card className="bg-gray-800 border border-gray-700 w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-400">Cannot Join Tournament</CardTitle>
            <CardDescription className="text-gray-400">
              {tournament.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-6">
            <div className="text-amber-400 mb-4">You are the creator of this tournament</div>
            <div className="text-gray-300 mb-4">
              As the tournament creator, you cannot participate as a player.
            </div>
            <Button 
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Combiner les équipes existantes et vides pour affichage
  const getDisplayTeams = () => {
    console.log("===== JOIN MODAL DEBUG: TEAMS DATA =====");
    console.log("Original teams from API:", teams);
    
    // Si aucune équipe n'est disponible, créer des placeholders
    if (!teams || teams.length === 0) {
      const maxTeams = tournament.max_teams || 8;
      console.log(`No teams found, creating ${maxTeams} placeholders`);
      
      return Array.from({ length: maxTeams }, (_, i) => {
        const letter = String.fromCharCode(65 + i);
        return {
          id: `empty-${i}`,
          name: `Team ${letter}`,
          isEmpty: true,
          team_index: i, // S'assurer que l'index est défini correctement
          letter: letter
        };
      });
    }
    
    // Trier les équipes par ID de base de données (ordre croissant)
    // Cela garantit que l'équipe avec l'ID le plus petit est à l'index 0, etc.
    const sortedTeams = [...teams].sort((a, b) => {
      const idA = parseInt(a.id, 10);
      const idB = parseInt(b.id, 10);
      if (!isNaN(idA) && !isNaN(idB)) {
        return idA - idB;
      }
      return 0;
    });
    
    console.log("===== TEAMS SORTED BY DATABASE ID =====");
    sortedTeams.forEach((team, idx) => {
      console.log(`Team ${idx}: ID: ${team.id}, Name: ${team.name}`);
    });
    
    // Assigner les équipes réelles aux positions dans l'ordre croissant de leur ID
    const maxTeams = tournament.max_teams || 8;
    const result = [];
    
    // Placer d'abord les équipes réelles triées par ID
    sortedTeams.forEach((team, index) => {
      if (index < maxTeams) {
        const letter = String.fromCharCode(65 + index);
        result.push({
          ...team,
          team_index: index,  // Assigner l'index en fonction de la position (0, 1, 2, ...)
          letter: letter      // La lettre est basée sur l'index (A, B, C, ...)
        });
        console.log(`Assigned team ${team.name} (ID: ${team.id}) to position ${index} with letter ${letter}`);
      }
    });
    
    // Ajouter des placeholders si nécessaire pour compléter jusqu'à maxTeams
    if (result.length < maxTeams) {
      for (let i = result.length; i < maxTeams; i++) {
        const letter = String.fromCharCode(65 + i);
        result.push({
          id: `empty-${i}`,
          name: `Team ${letter}`,
          isEmpty: true,
          team_index: i,
          letter: letter
        });
        console.log(`Added placeholder at position ${i} with letter ${letter}`);
      }
    }
    
    // Log des résultats finaux
    console.log("Final display teams with preserved order:", result);
    return result;
  };
  
  // Obtenir les slots disponibles pour une équipe
  const getAvailableSlots = () => {
    if (!selectedTeam) return [];
    
    const playersPerTeam = tournament.players_per_team || 4;
    const existingPlayers = selectedTeam.players || selectedTeam.team_members || [];
    
    // Créer un ensemble des slots déjà occupés
    const occupiedSlots = new Set();
    existingPlayers.forEach(player => {
      if (player.slot_number) {
        occupiedSlots.add(player.slot_number);
      }
    });
    
    // Générer tous les slots disponibles
    const availableSlots = [];
    for (let i = 1; i <= playersPerTeam; i++) {
      if (!occupiedSlots.has(i)) {
        availableSlots.push(i);
      }
    }
    
    return availableSlots;
  };
  
  // Vérifier si on peut rejoindre l'équipe
  const canJoinTeam = (team) => {
    console.log(`Checking if can join team ${team.name} (ID: ${team.id})`);
    
    // Si l'utilisateur est déjà dans une équipe du tournoi, il ne peut pas en rejoindre une autre
    if (userTeams.length > 0) {
      console.log(`User already in teams: ${userTeams.map(t => t.name).join(', ')}. Cannot join another.`);
      return false;
    }
    
    // Vérifier si c'est un placeholder ou une vraie équipe
    const isPlaceholder = team.id && String(team.id).startsWith('empty-');
    
    // Si c'est un placeholder, autoriser la jointure si la lettre correspond à une équipe réelle
    // ou s'il n'y a pas d'équipe réelle pour cette lettre
    if (isPlaceholder) {
      // Pour les tournois qui viennent d'être créés, on peut autoriser de rejoindre n'importe quelle équipe
      if (teams.length === 0) {
        console.log(`No real teams exist yet, allowing to join placeholder: ${team.name}`);
        return true;
      }
      
      const letter = team.letter || String.fromCharCode(65 + (team.team_index || 0));
      const realTeam = teams.find(t => 
        t.id && !String(t.id).startsWith('empty-') && 
        (t.letter === letter || t.team_index === team.team_index)
      );
      
      // Si aucune équipe réelle n'est trouvée pour cette lettre, autoriser de créer la première équipe
      if (!realTeam) {
        console.log(`No real team found for letter ${letter}, allowing to join: ${team.name}`);
        return true;
      }
      
      console.log(`Found real team ${realTeam.name} for placeholder ${team.name}`);
      const playersPerTeam = tournament.players_per_team || 4;
      const existingPlayers = realTeam.players || realTeam.team_members || [];
      
      const canJoin = existingPlayers.length < playersPerTeam;
      console.log(`Team ${realTeam.name} has ${existingPlayers.length}/${playersPerTeam} players. Can join: ${canJoin}`);
      return canJoin;
    }
    
    // Pour une équipe réelle, vérifier si elle a de la place
    const playersPerTeam = tournament.players_per_team || 4;
    const existingPlayers = team.players || team.team_members || [];
    
    const canJoin = existingPlayers.length < playersPerTeam;
    console.log(`Team ${team.name} has ${existingPlayers.length}/${playersPerTeam} players. Can join: ${canJoin}`);
    return canJoin;
  };
  
  // Gérer la privatisation de l'équipe (pour le premier joueur)
  const handleTogglePrivate = () => {
    setIsPrivateTeam(!isPrivateTeam);
  };

  const handleJoinTeam = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    console.log("===== HANDLING JOIN TEAM =====");
    
    if (!selectedTeam) {
      setError("Please select a team first");
      setIsLoading(false);
      return;
    }
    
    console.log("Selected team:", {
      id: selectedTeam.id,
      name: selectedTeam.name,
      index: selectedTeam.team_index,
      letter: selectedTeam.letter,
      isEmpty: selectedTeam.isEmpty
    });
    
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
        console.log(`Selected team has placeholder ID: ${teamId}, Index: ${teamIndex}`);
        
        // Vérifier si une équipe réelle existe déjà pour cette position
        const letter = selectedTeam.letter || String.fromCharCode(65 + teamIndex);
        console.log(`Looking for real team with letter ${letter}`);
        
        const realTeam = teams.find(t => 
          t.id && !String(t.id).startsWith('empty-') && 
          (t.letter === letter || t.team_index === teamIndex)
        );
        
        if (realTeam) {
          // Une équipe réelle existe, on la rejoint
          console.log(`Found real team to replace placeholder: ${realTeam.name} (ID: ${realTeam.id}, Index: ${realTeam.team_index})`);
          
          // Préparer les données
          const joinData = {
            slot_number: selectedSlot,
            is_private: isPrivateTeam
          };
          
          if (realTeam.invitation_code && invitationCode) {
            joinData.invitation_code = invitationCode;
          }
          
          if (tournament.entry_code && invitationCode) {
            joinData.entry_code = invitationCode;
          }
          
          console.log(`Joining existing team ${realTeam.id} with data:`, joinData);
          
          // Appel API pour rejoindre l'équipe existante
          const response = await kyInstance.post(`v1/tournaments/${tournament.id}/teams/${realTeam.id}/join`, {
            json: joinData
          }).json();
          
          console.log("API response for joining existing team:", response);
        } else {
          // Aucune équipe réelle n'existe pour cette lettre, on en crée une nouvelle
          console.log(`No real team found for letter ${letter}, creating a new team with index ${teamIndex}`);
          
          // Récupérer l'index visuel de l'équipe (position dans l'affichage)
          // Cet index sera utilisé pour déterminer la lettre (A, B, C...)
          const displayTeamsArray = getDisplayTeams();
          const visualIndex = displayTeamsArray.findIndex(t => t.id === selectedTeam.id);
          console.log(`Selected team visual index (position in UI): ${visualIndex}`);
          
          // Créer une nouvelle équipe en préservant les informations importantes
          const createTeamData = {
            name: selectedTeam.name, // Conserver le nom affiché dans l'UI
            is_private: isPrivateTeam,
            team_index: visualIndex // Utiliser l'index visuel pour conserver l'ordre d'affichage
          };
          
          console.log(`Creating new team with display position ${visualIndex} and data:`, createTeamData);
          
          if (tournament.entry_code && invitationCode) {
            createTeamData.entry_code = invitationCode;
          }
          
          try {
            // Créer l'équipe d'abord
            const createResponse = await kyInstance.post(`v1/tournaments/${tournament.id}/teams`, {
              json: createTeamData
            }).json();
            
            console.log("Team creation response:", createResponse);
            
            // Puis rejoindre l'équipe nouvellement créée
            const newTeamId = createResponse.id || createResponse.team?.id;
            
            if (!newTeamId) {
              throw new Error("Failed to get ID of newly created team");
            }
            
            const joinData = {
              slot_number: selectedSlot,
              is_private: isPrivateTeam
            };
            
            console.log(`Joining newly created team ${newTeamId} with data:`, joinData);
            
            const joinResponse = await kyInstance.post(`v1/tournaments/${tournament.id}/teams/${newTeamId}/join`, {
              json: joinData
            }).json();
            
            console.log("Join response for new team:", joinResponse);
          } catch (createErr) {
            console.error("Error creating/joining new team:", createErr);
            throw createErr;
          }
        }
      } else {
        // Cas d'une équipe existante
        console.log(`Using real team with ID: ${teamId}, Index: ${teamIndex}`);
        
        // Simplifier les données pour n'envoyer que le numéro du slot
        const joinData = {
          slot_number: selectedSlot,
          is_private: isPrivateTeam
        };
        
        // Si l'équipe a un code d'invitation, l'ajouter
        if (selectedTeam.invitation_code && invitationCode) {
          joinData.invitation_code = invitationCode;
        }
        
        // Si le tournoi a un code d'entrée, l'ajouter
        if (tournament.entry_code && invitationCode) {
          joinData.entry_code = invitationCode;
        }
        
        console.log(`Joining team ${selectedTeam.id} with data:`, joinData);
        
        // Appel API avec l'ID réel de l'équipe dans l'URL
        const response = await kyInstance.post(`v1/tournaments/${tournament.id}/teams/${selectedTeam.id}/join`, {
          json: joinData
        }).json();
        
        console.log("API response:", response);
      }
      
      // Récupérer les détails mis à jour de l'équipe après la jointure
      try {
        // Récupérer toutes les équipes pour être sûr d'avoir les données à jour
        const allTeamsResponse = await kyInstance.get(`v1/tournaments/${tournament.id}/teams`).json();
        console.log("Updated teams data:", allTeamsResponse);
      } catch (refreshErr) {
        console.error("Error refreshing team data:", refreshErr);
      }
      
      // Force le rafraîchissement des données du tournoi avec un délai pour laisser le backend mettre à jour
      toast.success("Joined team successfully!");
      setSuccess(true);
      
      // Utiliser un délai plus long pour le reload pour s'assurer que le backend a eu le temps de mettre à jour
      setTimeout(() => {
        console.log("Reloading page to refresh data...");
        window.location.reload();
      }, 3000); // Passer à 3 secondes pour donner plus de temps au backend
    } catch (err) {
      console.error("Error joining team:", err);
      const errorMessage = err.response?.data?.error || "Failed to join team. Please check the invitation code.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Formatage du nom du tournoi en majuscules
  const tournamentNameFormatted = tournament.name ? tournament.name.toUpperCase() : '';
  
  const displayTeams = getDisplayTeams();
  const availableSlots = getAvailableSlots();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-[800px] bg-[#111827] border border-gray-700 text-white rounded-md">
        {/* Header avec titre et bouton de fermeture */}
        <div className="bg-black p-4 flex justify-between items-center rounded-t-md">
          <h2 className="text-yellow-400 text-lg font-bold">
            {tournamentNameFormatted} - REGISTER
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Contenu principal */}
        <div className="p-6">
          {success ? (
            <div className="text-center p-8">
              <h3 className="text-green-400 text-xl mb-4">Registration Successful!</h3>
              <p className="text-gray-300 mb-6">You have successfully joined the tournament.</p>
              <Button 
                onClick={onClose}
                className="bg-primary hover:bg-primary/90 text-black"
              >
                Close
              </Button>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* En-tête d'informations */}
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center space-x-8">
                  <div className="text-sm text-gray-300">
                    <span className="font-bold">REMAINING SLOTS:</span> {tournament.max_teams - (teams?.length || 0)}/{tournament.max_teams}
                  </div>
                  <div className="text-sm text-gray-300">
                    <span className="font-bold">PLAYER(S) PER TEAM:</span> {tournament.players_per_team || 4}
                  </div>
                </div>
              </div>
              
              {/* Section principale en 3 colonnes */}
              <div className="grid grid-cols-3 gap-8 mb-8">
                {/* Colonne 1: Sélection d'équipe */}
                <div>
                  <h3 className="text-yellow-400 font-bold mb-4 text-center uppercase">Select Team</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {displayTeams.map((team, index) => {
                      // Utiliser le team_index de l'équipe, qui est maintenant garanti d'être défini
                      // et correspond à sa position alphabétique (A=0, B=1, etc.)
                      const teamIndex = team.team_index;
                      const teamColor = getTeamColor(teamIndex);
                      const isSelected = selectedTeam && selectedTeam.id === team.id;
                      const canJoin = canJoinTeam(team);
                      
                      // La lettre est basée sur le team_index, garantissant la cohérence avec la position de l'équipe
                      const teamLetter = String.fromCharCode(65 + teamIndex);
                      
                      // Déterminer le nom à afficher
                      const displayName = team.isEmpty ? `Team ${teamLetter}` : team.name;
                      
                      console.log(`Team button rendering: ${displayName}, Letter: ${teamLetter}, Index: ${teamIndex}, ID: ${team.id}`);
                      
                      return (
                        <button
                          key={`team-btn-${teamIndex}`}
                          className={`p-2 text-white transition-all rounded ${isSelected ? 'ring-2 ring-white' : ''}`}
                          style={{ 
                            backgroundColor: teamColor,
                            opacity: canJoin ? 1 : 0.5,
                            cursor: canJoin ? 'pointer' : 'not-allowed'
                          }}
                          onClick={() => canJoin && setSelectedTeam({...team, letter: teamLetter})}
                          disabled={!canJoin}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <div className="rounded-full w-6 h-6 flex items-center justify-center text-white font-bold bg-black/20">
                              {teamLetter}
                            </div>
                            <span className="font-bold">
                              {displayName}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Colonne 2: Sélection de slot */}
                <div>
                  <h3 className="text-yellow-400 font-bold mb-4 text-center uppercase">Select Slot</h3>
                  {selectedTeam ? (
                    <div>
                      {/* Afficher l'équipe sélectionnée */}
                      <div className="mb-4 p-2 text-center" 
                        style={{ backgroundColor: getTeamColor(selectedTeam.team_index) }}>
                        <span className="font-bold">
                          {selectedTeam.isEmpty 
                            ? `Team ${selectedTeam.letter || String.fromCharCode(65 + selectedTeam.team_index)}` 
                            : selectedTeam.name}
                        </span>
                      </div>
                      
                      {/* Afficher les slots disponibles */}
                      <div className="grid grid-cols-3 gap-3 justify-items-center">
                        {Array.from({ length: tournament.players_per_team || 4 }, (_, i) => {
                          const slotNum = i + 1;
                          
                          // Utiliser le team_index pour la cohérence des couleurs et lettres
                          const teamIndex = selectedTeam.team_index;
                          const teamLetter = selectedTeam.letter || String.fromCharCode(65 + teamIndex);
                          const slotId = `${teamLetter}${slotNum}`;
                          
                          // Déterminer si ce slot est occupé
                          const isOccupied = selectedTeam.players?.some(p => p.slot_number === slotNum) 
                            || selectedTeam.team_members?.some(m => m.slot_number === slotNum);
                          
                          // Déterminer si ce slot est sélectionnable
                          const isSelectable = availableSlots.includes(slotNum);
                          const isSlotSelected = selectedSlot === slotNum;
                          
                          console.log(`Slot rendering: ${slotId}, Team index: ${teamIndex}, Selectable: ${isSelectable}`);
                          
                          return (
                            <button
                              key={`slot-${teamLetter}${slotNum}`}
                              className={`rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold 
                                ${isOccupied ? 'opacity-50 cursor-not-allowed' : ''} 
                                ${isSlotSelected ? 'ring-2 ring-white' : ''}
                                ${isSelectable ? 'cursor-pointer hover:brightness-110' : 'cursor-not-allowed'}`}
                              style={{ backgroundColor: getTeamColor(teamIndex) }}
                              onClick={() => isSelectable && setSelectedSlot(slotNum)}
                              disabled={!isSelectable || isOccupied}
                            >
                              {slotId}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40 text-gray-400">
                      Please select a team first
                    </div>
                  )}
                </div>
                
                {/* Colonne 3: Options */}
                <div>
                  <h3 className="text-yellow-400 font-bold mb-4 text-center uppercase">Options</h3>
                  
                  {selectedTeam ? (
                    <>
                      {/* Option d'équipe privée */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="font-bold">PRIVATE TEAM</span>
                        <Switch
                          checked={isPrivateTeam}
                          onCheckedChange={handleTogglePrivate}
                        />
                      </div>
                      
                      {/* Code d'invitation */}
                      {(selectedTeam.invitation_code || (tournament.entry_code && selectedTeam.isEmpty)) && (
                        <div className="mb-6">
                          <Input
                            value={invitationCode}
                            onChange={(e) => setInvitationCode(e.target.value)}
                            placeholder="Enter invitation code"
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                      )}
                      
                      {/* Résumé de la sélection */}
                      <div className="mb-6">
                        <h4 className="text-sm font-bold mb-2">YOUR SELECTION</h4>
                        <div className="mb-1">
                          <span>Team:</span>
                          <span className="font-bold ml-2">
                            {selectedTeam.isEmpty 
                              ? `Team ${selectedTeam.letter || String.fromCharCode(65 + selectedTeam.team_index)}` 
                              : selectedTeam.name}
                          </span>
                        </div>
                        <div className="mb-1">
                          <span>Slot:</span>
                          <span className="font-bold ml-2">
                            {selectedSlot ? (
                              <>
                                {selectedTeam.letter || String.fromCharCode(65 + selectedTeam.team_index)}
                                {selectedSlot}
                              </>
                            ) : "None"}
                          </span>
                        </div>
                        <div>
                          <span>Privacy:</span>
                          <span className="font-bold ml-2">{isPrivateTeam ? "Private" : "Public"}</span>
                        </div>
                      </div>
                      
                      {error && (
                        <div className="text-red-400 mb-4 text-center">
                          {error}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-40 text-gray-400">
                      Please select a team first
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bouton de validation */}
              <div className="flex justify-center">
                <Button
                  onClick={handleJoinTeam}
                  disabled={isLoading || !selectedTeam || selectedSlot === null}
                  className={`bg-primary hover:bg-primary/90 text-black px-8 py-2 font-bold uppercase ${(!selectedTeam || selectedSlot === null) ? 'opacity-50' : ''}`}
                >
                  {isLoading ? "JOINING..." : "VALIDATE"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 