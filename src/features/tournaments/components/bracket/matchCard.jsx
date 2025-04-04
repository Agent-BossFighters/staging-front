import React from 'react';
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Edit, PlayCircle, Save } from 'lucide-react';
import { formatTimeOrScore } from '@features/tournaments/utils/timeFormatters';
import { getBossName } from '@features/tournaments/utils/tournamentUtils';
import { getTeamColor } from '@features/tournaments/constants/uiConfigs';
import EditScoreForm from '@features/tournaments/components/forms/editScoreForm';

const MatchCard = ({
  match,
  team,
  teamIndex,
  tournament,
  isCreator,
  isShowtimeSurvival,
  editingMatch,
  scores,
  saving,
  onEditScores,
  onStartMatch,
  onCompleteMatch,
  onScoreChange,
  onSaveScores,
  onCancelEdit
}) => {
  const teamColor = getTeamColor(teamIndex);
  
  return (
    <div className="bg-gray-800 rounded-md overflow-hidden">
      {/* Status badge */}
      <div className="flex justify-between items-center bg-gray-700 px-3 py-2">
        <span className="text-gray-300 text-sm">
          Match #{match.id}
          {match.round_number && match.round_number > 1 && (
            <span className="ml-2 text-primary">Round {match.round_number}</span>
          )}
        </span>
        <Badge className={
          match.status === 'completed' ? 'bg-green-600' : 
          match.status === 'in_progress' ? 'bg-blue-600' : 'bg-gray-600'
        }>
          {match.status?.toUpperCase() || 'PENDING'}
        </Badge>
      </div>
      
      <div className="p-4">
        {/* Team vs Boss */}
        <div className={`${teamColor} flex justify-between items-center mb-2 p-2 rounded-md ${tournament.status === 3 && teamIndex === 0 ? 'border-2 border-primary' : ''}`}>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-bold mr-2">
              {String.fromCharCode(65 + teamIndex)}
            </div>
            <div className="text-white font-medium">
              {team.name}
              {tournament.status === 3 && teamIndex === 0 && (
                <span className="ml-2 text-primary">👑</span>
              )}
            </div>
          </div>
          <div className="text-white font-bold text-lg">
            {isShowtimeSurvival 
              ? formatTimeOrScore(match.team_a_points, "time")
              : match.team_a_points || '0'
            }
          </div>
        </div>
        
        <div className="flex justify-center items-center my-2 text-gray-400">VS</div>
        
        <div className="bg-red-900 flex justify-between items-center p-2 rounded-md">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-bold mr-2">
              B
            </div>
            <div className="text-red-300 font-medium">{getBossName(tournament)}</div>
          </div>
          <div className="text-white font-bold text-lg">
            {match.team_b_points || '0'}
          </div>
        </div>
        
        {/* Admin controls */}
        {isCreator && tournament.status !== 3 && (
          <div className="flex justify-end gap-2 mt-4">
            {/* Permettre l'édition pour tous les matchs tant que le tournoi n'est pas terminé */}
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onEditScores(match)}
            >
              <Edit size={14} className="mr-1" />
              EDIT
            </Button>
            
            {match.status === 'pending' && (
              <Button
                size="sm"
                variant="outline"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => onStartMatch(match)}
              >
                <PlayCircle size={14} className="mr-1" />
                START
              </Button>
            )}
            
            {(match.status === 'in_progress' || match.status === 'scheduled') && (
              <Button
                size="sm"
                variant="outline"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onCompleteMatch(match)}
              >
                <Save size={14} className="mr-1" />
                TERMINER
              </Button>
            )}
          </div>
        )}
        
        {/* Score edit form */}
        {editingMatch && editingMatch.id === match.id && (
          <EditScoreForm
            team={team}
            tournament={tournament}
            scores={scores}
            saving={saving}
            isShowtimeSurvival={isShowtimeSurvival}
            onScoreChange={onScoreChange}
            onSaveScores={onSaveScores}
            onCancelEdit={onCancelEdit}
          />
        )}
      </div>
    </div>
  );
};

export default MatchCard;
