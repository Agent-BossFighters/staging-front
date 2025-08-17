import React, { useState, useRef, useEffect } from 'react';
import { getTeamColor } from '../../constants/uiConfigs';
import { Button } from "@shared/ui/button";
import TeamManageModal from '../TeamManageModal';

const TeamsList = ({ teams, user, tournament }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const teamsContainerRef = useRef(null);
  const scrollbarRef = useRef(null);
  
  const getTeamPlayers = (team) => {
    const players = [];
    if (team.isEmpty) {
      return [];
    }
    
    // Si l'équipe a des membres (d'après le compteur) mais le tableau est vide,
    // essayer de récupérer les membres d'une autre façon
    if (team.members_count > 0 && 
       (!team.team_members || team.team_members.length === 0)) {
      
      return Array.from({ length: team.members_count }, (_, i) => ({
        id: `placeholder-${team.id}-${i}`,
        username: `Member ${i+1}`,
        slot_number: i+1
      }));
    }
    
    // Équipe explicitement marquée comme vide
    if (team.is_empty === true && 
        (!team.team_members || team.team_members.length === 0) && 
        team.members_count === 0) {
      return [];
    }
    
    if (team.team_members && Array.isArray(team.team_members)) {
    
      // Trier par slot_number si disponible
      const sortedMembers = [...team.team_members].sort(
        (a, b) => (a.slot_number || 0) - (b.slot_number || 0)
      );
      
      sortedMembers.forEach(member => {
        if (member.user) {
          players.push(member.user);
        }
        else if (member.player) {
          players.push(member.player);
        }
        // Si user_id est présent mais pas l'objet complet, créer un objet joueur basique
        else if (member.user_id) {
          players.push({ 
            id: member.user_id, 
            username: `Player ${member.slot_number || ''}`,
            slot_number: member.slot_number
          });
        }
      });
      return players;
    }
    
    // Last resort: utiliser members_count pour générer des placeholders
    if (team.members_count && team.members_count > 0) {
      return Array.from({ length: team.members_count }, (_, i) => ({
        id: `count-placeholder-${team.id}-${i}`,
        username: `Member ${i+1}`,
        slot_number: i+1
      }));
    }
    return [];
  };

  // Fonction pour vérifier si l'utilisateur est le capitaine d'une équipe
  const isTeamCaptain = (team) => {
    if (!user) return false;
    return team.captain_id === user.id;
  };

  // Fonction pour formater les membres pour la modal
  const formatMembers = (players) => {
    return players.map(player => ({
      playerId: player.id,
      username: player.username || 'Joueur sans nom'
    }));
  };
  
  // Generate empty teams structure based on max_teams from tournament
  const generateEmptyTeams = () => {
    if (!tournament) return [];
    
    const maxTeams = tournament.max_teams || 8; // Default to 8 if not specified
    const existingTeamsMap = {};
    
    // Trier les équipes réelles par ID numérique (pour garantir un ordre stable)
    const sortedTeams = teams ? [...teams].sort((a, b) => {
      const idA = parseInt(a.id, 10);
      const idB = parseInt(b.id, 10);
      if (!isNaN(idA) && !isNaN(idB)) {
        return idA - idB;
      }
      return 0;
    }) : [];
    
    // Assigner les équipes réelles aux positions dans l'ordre croissant de leur ID
    // Cela garantit que l'équipe avec l'ID le plus petit est à l'index 0, etc.
    sortedTeams.forEach((team, index) => {
      if (index < maxTeams) {
        existingTeamsMap[index] = team;
        team.team_index = index;
      }
    });
    
    // Générer le tableau final avec toutes les équipes à leur bonne position
    const result = [];
    for (let index = 0; index < maxTeams; index++) {
      const letter = String.fromCharCode(65 + index); // A, B, C, ...
      
      if (existingTeamsMap[index]) {
        const team = existingTeamsMap[index];
        // Ajouter team_index et letter à l'équipe existante
        result.push({
          ...team,
          team_index: index,
          letter: letter
        });
      } else {
        // Créer un placeholder pour cet index
        result.push({
          id: `empty-${index}`,
          name: `Team ${letter}`,
          isEmpty: true,
          team_index: index,
          letter: letter
        });
      }
    } 
    return result;
  };
  
  // Generate slots for players in a team
  const generatePlayerSlots = (team) => {
    if (!tournament) return [];
    
    const playersPerTeam = tournament.players_per_team || 4; // Default to 4 if not specified
    const existingPlayers = getTeamPlayers(team);
    
    return Array.from({ length: playersPerTeam }, (_, index) => {
      const playerNumber = index + 1;
      const existingPlayer = existingPlayers[index];
      
      if (existingPlayer) {
        return existingPlayer;
      } else {
        // Create an empty slot
        return {
          id: `empty-${team.id}-${index}`,
          isEmpty: true,
          slotNumber: playerNumber
        };
      }
    });
  };
  
  const allTeams = generateEmptyTeams();
  
  // Update scroll position on scroll
  useEffect(() => {
    const handleScrollEvent = () => {
      if (teamsContainerRef.current) {
        setScrollPosition(teamsContainerRef.current.scrollLeft);
      }
    };
    
    const containerRef = teamsContainerRef.current;
    if (containerRef) {
      containerRef.addEventListener('scroll', handleScrollEvent);
      return () => containerRef.removeEventListener('scroll', handleScrollEvent);
    }
  }, []);
  
  // Gestion du défilement par clic/glissement sur la barre
  const handleScrollbarMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    
    // Calculer le déplacement en fonction de la position du clic
    const handleMouseMove = (moveEvent) => {
      if (!teamsContainerRef.current || !scrollbarRef.current) return;
      
      const scrollbarRect = scrollbarRef.current.getBoundingClientRect();
      const scrollbarWidth = scrollbarRect.width;
      const clickPositionRatio = (moveEvent.clientX - scrollbarRect.left) / scrollbarWidth;
      
      // Limiter le ratio entre 0 et 1
      const boundedRatio = Math.max(0, Math.min(1, clickPositionRatio));
      
      const maxScroll = teamsContainerRef.current.scrollWidth - teamsContainerRef.current.clientWidth;
      
      // Utiliser requestAnimationFrame pour une animation plus fluide
      requestAnimationFrame(() => {
        teamsContainerRef.current.scrollLeft = maxScroll * boundedRatio;
      });
    };
    
    // Gérer le mouvement de la souris
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    // Ajouter les écouteurs d'événements
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Déplacer immédiatement au clic
    handleMouseMove(e);
  };
  
  // Support pour les événements tactiles
  const handleScrollbarTouchStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    
    const touch = e.touches[0];
    
    const handleTouchMove = (moveEvent) => {
      if (!teamsContainerRef.current || !scrollbarRef.current) return;
      
      const touch = moveEvent.touches[0];
      const scrollbarRect = scrollbarRef.current.getBoundingClientRect();
      const scrollbarWidth = scrollbarRect.width;
      const touchPositionRatio = (touch.clientX - scrollbarRect.left) / scrollbarWidth;
      
      // Limiter le ratio entre 0 et 1
      const boundedRatio = Math.max(0, Math.min(1, touchPositionRatio));
      
      const maxScroll = teamsContainerRef.current.scrollWidth - teamsContainerRef.current.clientWidth;
      
      requestAnimationFrame(() => {
        teamsContainerRef.current.scrollLeft = maxScroll * boundedRatio;
      });
    };
    
    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    // Déplacer immédiatement au toucher
    const initialTouch = e.touches[0];
    const scrollbarRect = scrollbarRef.current.getBoundingClientRect();
    const scrollbarWidth = scrollbarRect.width;
    const touchPositionRatio = (initialTouch.clientX - scrollbarRect.left) / scrollbarWidth;
    const boundedRatio = Math.max(0, Math.min(1, touchPositionRatio));
    const maxScroll = teamsContainerRef.current.scrollWidth - teamsContainerRef.current.clientWidth;
    
    requestAnimationFrame(() => {
      teamsContainerRef.current.scrollLeft = maxScroll * boundedRatio;
    });
  };
  
  return (
    <div className="w-full">
      <div className="flex">
        {/* TEAMS label à gauche */}
        <div className="bg-primary text-black font-bold flex items-center justify-center min-w-[60px] w-1/6 py-4 mr-4">
          <span className="text-md lg:text-xl">TEAMS</span>
        </div>
        
        {/* Teams container with horizontal scroll */}
        <div
          className="flex-1 overflow-hidden"
        >
          
          <div 
            ref={teamsContainerRef}
            className="flex overflow-x-auto pb-2"
            style={{ 
              maxWidth: "100%", 
              overflowX: "auto",
              /* Masquer la barre de défilement native */
              scrollbarWidth: "none", /* Firefox */
              msOverflowStyle: "none", /* IE/Edge */
            }}
          >
            {/* Masquer la barre de défilement pour Chrome/Safari/Opera */}
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {allTeams.length > 0 ? (
              allTeams.map((team, index) => {
                const teamColor = getTeamColor(index);
                const isCaptain = isTeamCaptain(team);
                const playerSlots = generatePlayerSlots(team);
                
                return (
                  <div 
                    key={team.id} 
                    className="min-w-[220px] flex-shrink-0 mr-4 last:mr-0"
                  >
                    <div 
                      style={{ backgroundColor: teamColor }} 
                      className=" flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 pl-1">
                        <div className="rounded-full w-7 h-7 flex items-center justify-center text-white font-bold bg-black/20">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-white flex items-center justify-center font-bold min-h-[42px]" title={team.name}>
                          {team.isEmpty ? `TEAM ${String.fromCharCode(65 + index)}` : team.name.length < 11 ? team.name : team.name.slice(0, 11) + "..."}
                        </span>
                      </div>
                      {isCaptain && !team.isEmpty && (
                        <Button
                          variant="ghost"
                          className="h-8 py-0 px-2 text-sm text-white hover:bg-white/20 rounded"
                          onClick={() => setSelectedTeam(team)}
                        >
                          Manage
                        </Button>
                      )}
                    </div>
                    
                    {/* Player slots in a darker background */}
                    <div className="bg-gray-900 pl-1 py-2">
                      {playerSlots.map((player, playerIndex) => {
                        const playerNum = playerIndex + 1;
                        const hasRealPlayer = !player.isEmpty;
                        const slotNumber = player.slot_number || player.slotNumber || playerNum;
                        
                        return (
                          <div key={`player-${playerNum}`} className="flex items-center gap-2 mb-2 last:mb-0">
                            <div 
                              style={{ backgroundColor: teamColor }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white
                                ${hasRealPlayer ? 'ring-1 ring-white' : ''}
                              `}
                            >
                              {`${String.fromCharCode(65 + index)}${slotNumber}`}
                            </div>
                            <span className={`text-sm font-medium ${hasRealPlayer ? 'text-white' : 'text-gray-500'}`}>
                              {hasRealPlayer 
                                ? (player.username || `Player ${slotNumber}`) 
                                : ''
                              }
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-400 p-4">No team has joined this tournament yet.</div>
            )}
          </div>
          
          {/* Scrollbar indicator */}
          <div 
            ref={scrollbarRef}
            className="relative h-8 lg:h-6 mt-2 cursor-pointer"
            onMouseDown={handleScrollbarMouseDown}
            onTouchStart={handleScrollbarTouchStart}
          >
            <div className="absolute inset-0 bg-gray-700 rounded-full"></div>
            <div 
              className={`absolute h-full bg-gray-300 rounded-full ${isDragging ? 'bg-gray-400' : ''}`}
              style={{ 
                width: teamsContainerRef.current && teamsContainerRef.current.scrollWidth > teamsContainerRef.current.clientWidth
                  ? `${Math.min(100, (teamsContainerRef.current.clientWidth / teamsContainerRef.current.scrollWidth) * 100)}%` 
                  : '100%',
                left: teamsContainerRef.current && teamsContainerRef.current.scrollWidth > teamsContainerRef.current.clientWidth
                  ? `${(scrollPosition / (teamsContainerRef.current.scrollWidth - teamsContainerRef.current.clientWidth)) * (100 - (teamsContainerRef.current.clientWidth / teamsContainerRef.current.scrollWidth) * 100)}%` 
                  : '0%',
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Modal de gestion d'équipe */}
      {selectedTeam && (
        <TeamManageModal
          isOpen={!!selectedTeam}
          onClose={() => setSelectedTeam(null)}
          team={selectedTeam}
          members={formatMembers(getTeamPlayers(selectedTeam))}
          onMemberKicked={() => {}} // Ne pas fermer la modal après exclusion
        />
      )}
    </div>
  );
};

export default TeamsList;
