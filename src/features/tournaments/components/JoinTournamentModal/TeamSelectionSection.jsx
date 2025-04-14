import toast from "react-hot-toast";
import { getTeamColor } from "../../constants/uiConfigs";
import { getDisplayTeams, canJoinTeam } from "../../utils";

/**
 * Section pour sélectionner une équipe dans le formulaire de jointure
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.tournament - Le tournoi
 * @param {Array} props.teams - Les équipes du tournoi
 * @param {Array} props.userTeams - Les équipes de l'utilisateur
 * @param {Object} props.selectedTeam - L'équipe actuellement sélectionnée
 * @param {Function} props.setSelectedTeam - Définit l'équipe sélectionnée
 * @returns {JSX.Element} - Élément JSX
 */
export function TeamSelectionSection({
  tournament,
  teams,
  userTeams,
  selectedTeam,
  setSelectedTeam
}) {
  const displayTeams = getDisplayTeams(teams, tournament);
  
  return (
    <div>
      <h3 className="text-yellow-400 font-bold mb-4 text-center uppercase">Select Team</h3>
      <div className="grid grid-cols-2 gap-2">
        {displayTeams.map((team, index) => {
          const teamIndex = team.team_index;
          const teamColor = getTeamColor(teamIndex);
          const isSelected = selectedTeam && selectedTeam.id === team.id;
          const canJoin = canJoinTeam(team, tournament, teams, userTeams);
          
          const teamLetter = String.fromCharCode(65 + teamIndex);
          
          const displayName = team.isEmpty ? `Team ${teamLetter}` : team.name;
          
          const isPrivate = team.invitation_code !== undefined && team.invitation_code !== null;
          
          return (
            <button
              key={`team-btn-${teamIndex}`}
              className={`p-2 text-white transition-all rounded ${isSelected ? 'ring-2 ring-white' : ''}`}
              style={{
                backgroundColor: teamColor,
                opacity: canJoin ? 1 : 0.5,
                cursor: canJoin ? 'pointer' : 'not-allowed'
              }}
              onClick={() => {
                if (canJoin) {
                  setSelectedTeam({...team, letter: teamLetter});
                } else {
                  toast.error("You cannot join this team");
                }
              }}
              disabled={!canJoin}
            >
              <div className="flex items-center justify-center gap-2">
                <div className="rounded-full w-6 h-6 flex items-center justify-center text-white font-bold bg-black/20">
                  {teamLetter}
                </div>
                <span className="font-bold">
                  {displayName}
                  {isPrivate && (
                    <span className="ml-1 text-xs bg-black/30 px-1 rounded">🔒</span>
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
} 