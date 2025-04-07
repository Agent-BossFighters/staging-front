import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { useAuth } from "@context/auth.context"; 
import { kyInstance } from "@utils/api/ky-config";
import toast from "react-hot-toast";

export default function TeamsList({ teams, isLoading, tournamentId, maxPlayers }) {
  const { user } = useAuth();
  const [showInviteCode, setShowInviteCode] = useState({});

  // Fonction pour afficher/masquer le code d'invitation
  const toggleInviteCode = (teamId) => {
    setShowInviteCode(prev => ({
      ...prev,
      [teamId]: !prev[teamId]
    }));
  };
  
  // Fonction pour rejoindre directement une équipe
  const handleJoinTeam = async (teamId, invitationCode) => {
    try {
      if (!confirm("Êtes-vous sûr de vouloir rejoindre cette équipe ?")) return;
      
      // Envoi du code d'invitation pour rejoindre l'équipe
      await kyInstance.post(`v1/tournaments/${tournamentId}/teams/${teamId}/join`, {
        json: {
          invitation_code: invitationCode
        }
      }).json();
      
      toast.success("Vous avez rejoint l'équipe !");
      window.location.reload();
    } catch (err) {
      console.error("Erreur lors de la tentative de rejoindre l'équipe:", err);
      const errorMessage = err.responseData?.error || "Impossible de rejoindre l'équipe. Veuillez réessayer.";
      
      if (errorMessage.includes("invitation") || errorMessage.includes("code")) {
        toast.error("Code d'invitation invalide. Vérifiez le code et réessayez.");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // Fonction pour copier le code d'invitation dans le presse-papier
  const copyInviteCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Code d'invitation copié dans le presse-papier !");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="loader">Loading teams...</div>
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        No teams have joined this tournament yet.
      </div>
    );
  }

  // Fonction pour extraire les membres de l'équipe, peu importe leur structure
  const getTeamMembers = (team) => {
    const members = [];
    
    // Option 1: Via players
    if (team.players && Array.isArray(team.players)) {
      members.push(...team.players);
    }
    
    // Option 2: Via team_members avec player ou user
    if (team.team_members && Array.isArray(team.team_members)) {
      team.team_members.forEach(member => {
        if (member.player) {
          members.push({
            ...member.player,
            slot_number: member.slot_number,
            level: member.player.level || member.player.agent_level || 1
          });
        } else if (member.user) {
          members.push({
            ...member.user,
            slot_number: member.slot_number,
            level: member.user.level || member.user.agent_level || 1
          });
        }
      });
    }
    
    // Trier par numéro de slot si disponible
    return members.sort((a, b) => (a.slot_number || 0) - (b.slot_number || 0));
  };

  const getTeamMemberCount = (team) => {
    if (team.players && Array.isArray(team.players)) {
      return team.players.length;
    }
    
    if (team.team_members && Array.isArray(team.team_members)) {
      return team.team_members.length;
    }

    return 0;
  };

  const getCaptainName = (team) => {
    // Essayons d'abord captain.username
    if (team.captain && team.captain.username) {
      return team.captain.username;
    }
    
    // Essayons de trouver le capitaine dans les membres
    if (team.team_members && Array.isArray(team.team_members) && team.captain_id) {
      // Chercher le membre qui est capitaine
      const captainMember = team.team_members.find(m => 
        (m.player && m.player.id === team.captain_id) || 
        (m.user && m.user.id === team.captain_id)
      );
      
      if (captainMember) {
        return captainMember.player?.username || captainMember.user?.username;
      }
    }
    
    return "Unknown";
  };

  // Fonction pour vérifier si l'équipe est complète
  const isTeamFull = (team) => {
    return getTeamMemberCount(team) >= maxPlayers;
  };

  // Fonction pour vérifier si l'utilisateur est déjà dans une équipe
  const isUserInAnyTeam = teams.some(team => team.is_user_team === true || team.is_captain === true);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map((team) => {
        // Extraire les membres peu importe la structure
        const members = getTeamMembers(team);
        const memberCount = getTeamMemberCount(team);
        const teamIsFull = isTeamFull(team);
        const isUserTeam = team.is_user_team === true || team.is_captain === true;
        const invitationCode = team.invitation_code || "";
        
        return (
          <Card key={team.id} className={`bg-gray-800 border ${isUserTeam ? 'border-primary' : 'border-gray-700'} hover:border-gray-500 transition-all`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex justify-between items-center">
                {team.name}
                {isUserTeam && (
                  <span className="text-xs bg-primary text-black px-2 py-1 rounded">Your Team</span>
                )}
              </CardTitle>
              <div className="text-sm text-gray-400">
                Captain: {getCaptainName(team)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Members:</span>
                <span className="text-sm text-white">{memberCount}/{maxPlayers}</span>
              </div>

              <div className="space-y-2 mt-3">
                {/* Afficher les membres existants */}
                {members.map((player) => (
                  <div key={player.id} className="flex items-center bg-gray-700 p-2 rounded">
                    <div className="w-8 h-8 rounded-full bg-gray-600 mr-2 flex items-center justify-center text-sm">
                      {player.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="text-white text-sm">{player.username}</div>
                      <div className="text-gray-400 text-xs">
                        Level {player.level || player.agent_level || 1}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Afficher les slots vides */}
                {Array.from({ length: maxPlayers - memberCount }).map((_, index) => (
                  <div key={`empty-${index}`} className="flex items-center bg-gray-700/50 p-2 rounded border border-dashed border-gray-600">
                    <div className="w-8 h-8 rounded-full bg-gray-600/50 mr-2 flex items-center justify-center text-gray-500">
                      ?
                    </div>
                    <div className="text-gray-500 text-sm">Empty Slot</div>
                  </div>
                ))}
              </div>

              {/* Actions pour cette équipe */}
              <div className="mt-4 space-y-2">
                {isUserTeam ? (
                  <Link 
                    to={`/dashboard/tournaments/${tournamentId}/teams/${team.id}`}
                    className="block text-center text-primary hover:underline"
                  >
                    Manage Team
                  </Link>
                ) : !isUserInAnyTeam && !teamIsFull && user ? (
                  <>
                    {/* Afficher le code d'invitation */}
                    {showInviteCode[team.id] ? (
                      <div className="mb-2 p-2 bg-gray-700 rounded text-center">
                        <p className="text-sm text-gray-300 mb-1">Code d'invitation :</p>
                        <div className="flex items-center justify-center gap-2">
                          <code className="bg-gray-800 px-2 py-1 rounded text-primary">{invitationCode || "Aucun code"}</code>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyInviteCode(invitationCode)}
                            className="h-7 px-2"
                          >
                            Copier
                          </Button>
                        </div>
                        <Button 
                          variant="link"
                          size="sm"
                          onClick={() => toggleInviteCode(team.id)}
                          className="text-xs text-gray-400"
                        >
                          Masquer le code
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full border-gray-600 text-gray-300 mb-2"
                        onClick={() => toggleInviteCode(team.id)}
                      >
                        Afficher le code d'invitation
                      </Button>
                    )}
                    
                    {/* Bouton pour rejoindre avec le code */}
                    <Button 
                      onClick={() => handleJoinTeam(team.id, invitationCode)}
                      className="w-full bg-primary hover:bg-primary/80 text-black"
                    >
                      Rejoindre cette équipe
                    </Button>
                  </>
                ) : teamIsFull ? (
                  <div className="text-center text-gray-400 text-sm mt-2">
                    Équipe complète
                  </div>
                ) : isUserInAnyTeam ? (
                  <div className="text-center text-gray-400 text-sm mt-2">
                    Vous êtes déjà dans une équipe
                  </div>
                ) : (
                  <div className="text-center text-gray-400 text-sm mt-2">
                    Connectez-vous pour rejoindre
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 