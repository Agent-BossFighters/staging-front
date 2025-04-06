import React from 'react';
import { Button } from "@shared/ui/button";
import { Save, X } from 'lucide-react';
import { getBossName } from '@features/tournaments/utils/tournamentUtils';

const EditScoreForm = ({
  team,
  tournament,
  scores,
  saving,
  isShowtimeSurvival,
  onScoreChange,
  onSaveScores,
  onCancelEdit
}) => {
  return (
    <div className="bg-gray-700 p-4 border-t border-gray-600">
      <div className="flex justify-between items-center mb-3">
        <span className="text-white">{team.name}</span>
        <div className="flex flex-col gap-1">
          {isShowtimeSurvival ? (
            <div className="flex flex-col">
              <div className="flex items-center justify-end mb-1">
                <span className="text-sm text-gray-400 mr-2">
                  Temps (MM:SS):
                </span>
                <input 
                  type="text"
                  pattern="^[0-9]{1,2}:[0-9]{2}$"
                  placeholder="MM:SS"
                  className="w-24 text-center bg-gray-600 text-white border border-gray-500 rounded p-1"
                  value={scores.team_a_time}
                  onChange={(e) => onScoreChange('team_a_time', e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-400 italic">Format: minutes:secondes (ex: 9:36)</p>
            </div>
          ) : (
            <div className="flex items-center justify-end">
              <span className="text-sm text-gray-400 mr-2">
                Score:
              </span>
              <input 
                type="number"
                min="0"
                className="w-16 text-center bg-gray-600 text-white border border-gray-500 rounded p-1"
                value={scores.team_a_points}
                onChange={(e) => onScoreChange('team_a_points', e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-red-400">{getBossName(tournament)}</span>
        <input 
          type="number"
          min="0"
          className="w-16 text-center bg-gray-600 text-white border border-gray-500 rounded p-1"
          value={scores.team_b_points}
          onChange={(e) => onScoreChange('team_b_points', e.target.value)}
        />
      </div>
        
      <div className="flex justify-end gap-2">
        <Button 
          size="sm" 
          variant="default"
          className="bg-green-500 hover:bg-green-600 text-white"
          onClick={onSaveScores}
          disabled={saving}
        >
          <Save size={14} className="mr-1" />
          {saving ? "..." : "SAVE"}
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={onCancelEdit}
          disabled={saving}
        >
          <X size={14} className="mr-1" />
          CANCEL
        </Button>
      </div>
    </div>
  );
};

export default EditScoreForm; 