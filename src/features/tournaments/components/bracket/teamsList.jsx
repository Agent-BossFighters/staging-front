import React from 'react';
import { getTeamColor } from '../../constants/uiConfigs';

const TeamsList = ({ teams }) => {
  // Fonction pour récupérer les joueurs d'une équipe dans l'ordre des slots
  const getTeamPlayers = (team) => {
    const players = [];
    
    // Option 1: Structure team.players
    if (team.players && Array.isArray(team.players)) {
      return team.players;
    }
    
    // Option 2: Structure team.team_members
    if (team.team_members && Array.isArray(team.team_members)) {
      // Trier par slot_number si disponible
      const sortedMembers = [...team.team_members].sort(
        (a, b) => (a.slot_number || 0) - (b.slot_number || 0)
      );
      
      sortedMembers.forEach(member => {
        if (member.user) players.push(member.user);
        else if (member.player) players.push(member.player);
      });
      
      return players;
    }
    
    return [];
  };
  
  return (
    <div className="flex h-full gap-3">
      {/* TEAMS label */}
      <div className="bg-primary text-black font-bold p-3 flex items-center justify-center w-28">
        <span className="text-xl">TEAMS</span>
      </div>
      
      {/* Teams cards */}
      <div className="flex-1 flex gap-3">
        {teams?.length > 0 ? (
          teams.map((team, index) => {
            const players = getTeamPlayers(team);
            const teamColor = getTeamColor(index);
            
            return (
              <div 
                key={team.id} 
                className={`flex-1 flex flex-col min-h-full p-4`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    style={{ backgroundColor: teamColor }} 
                    className="flex w-full items-center justify-center text-sm font-bold text-white gap-2 px-2"
                  >
                    {String.fromCharCode(65 + index)}
                    <span className="text-white text-lg font-bold">{team.name}</span>
                  </div>
                </div>
                
                {/* N'affiche que les joueurs qui existent réellement */}
                {players.map((player, playerIndex) => {
                  const playerNum = playerIndex + 1;
                  
                  return (
                    <div key={`player-${playerNum}`} className="flex items-center gap-2 mb-1"> 
                      <div 
                        style={{ backgroundColor: teamColor }}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white gap-2 p-1"
                      >
                        {`P${playerNum}`}
                      </div>
                      <span className="text-white text-sm font-bold">
                        {player.username || `Joueur ${playerNum}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })
        ) : (
          <div className="text-gray-400 p-4">Aucune équipe n'a encore rejoint ce tournoi.</div>
        )}
      </div>
    </div>
  );
};

export default TeamsList;
