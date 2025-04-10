import React from 'react';
import { Button } from "@shared/ui/button";
import { PlayCircle } from 'lucide-react';
import { formatTimeOrScore } from '../../utils/timeFormatters';
import { getTeamColor } from '../../constants/uiConfigs';
import { getBossName } from '../../utils/tournamentUtils';
import { headBoss, stopwatch } from '@img';

const RoundsList = ({
  tournament,
  teams,
  numberOfRounds,
  groupedMatches,
  isCreator,
  generatingMatches,
  isShowtimeSurvival,
  isEditingAllScores,
  allScores,
  onGenerateMatches,
  onAllScoreChange
}) => {
  // Utiliser le nombre de rounds configuré (avec fallback sur le nombre détecté)
  const configuredRounds = parseInt(tournament?.rounds) || 1;
  const actualRounds = Math.max(configuredRounds, numberOfRounds);
  
  return (
    <div className="rounds-list">
      {Array.from({ length: actualRounds }).map((_, roundIndex) => {
        const round = roundIndex + 1;
        const roundMatches = groupedMatches[round] || [];
        
        return (
          <div key={round} className="flex mb-3 gap-2">
            {/* Round label */}
            <div className="bg-primary text-black font-bold p-3 w-[120px] flex justify-center items-center gap-2">
              <span>ROUND {round}</span>
            </div>
            
            {/* Matches */}
            <div className="flex-1 flex gap-3">
              {roundMatches.length > 0 ? (
                teams?.slice(0, 4).map((team, index) => {
                  const match = roundMatches.find(m => m.team_a_id === team.id);
                  if (!match) return null;
                  
                  const scoreA = match.team_a_points || 0;
                  const scoreB = match.team_b_points || 0;
                  const bossName = getBossName(tournament);
                  const teamColor = getTeamColor(index);
                  
                  return (
                    <div key={`${round}-${team.id}`} className=" flex-1 p-2 flex flex-col items-center justify-center">
                      <div className="flex items-center mb-3 gap-2">
                        <div className="flex items-center gap-2 w-8 h-8">
                          <img src={headBoss} alt="headBoss" className="w-8 h-8" />
                        </div>
                        <span className="text-white text-sm">VS</span>
                        <div 
                          style={{ backgroundColor: teamColor }}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold mr-2 text-xs"
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                      </div>
                      
                      {isEditingAllScores ? (
                        <div className="w-full p-2">
                          <div className="flex flex-col gap-2">
                            {/* Team A Score */}
                            <div className="flex flex-col items-center">
                              <div className="text-white text-xs mb-1">Équipe</div>
                              {isShowtimeSurvival ? (
                                <div className="flex flex-col items-center">
                                  <input 
                                    type="text"
                                    pattern="^[0-9]{1,2}:[0-9]{2}$"
                                    placeholder="MM:SS"
                                    className="w-24 text-center bg-gray-600 text-white border border-gray-500 rounded p-1"
                                    value={allScores[match.id]?.team_a_time || ""}
                                    onChange={(e) => onAllScoreChange(match.id, 'team_a_time', e.target.value)}
                                  />
                                  <p className="text-xs text-gray-400 italic mt-1">Format: mm:ss</p>
                                </div>
                              ) : (
                                <input
                                  type="number"
                                  min="0"
                                  className="w-16 text-center bg-gray-600 text-white border border-gray-500 rounded p-1"
                                  value={allScores[match.id]?.team_a_points || 0}
                                  onChange={(e) => onAllScoreChange(match.id, 'team_a_points', e.target.value)}
                                />
                              )}
                            </div>
                            
                            {/* Team B / Boss Score */}
                            <div className="flex flex-col items-center">
                              <div className="text-red-400 text-xs mb-1">{bossName}</div>
                              <input
                                type="number"
                                min="0"
                                className="w-16 text-center bg-gray-600 text-white border border-gray-500 rounded p-1"
                                value={allScores[match.id]?.team_b_points || 0}
                                onChange={(e) => onAllScoreChange(match.id, 'team_b_points', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-4">
                            <img src={stopwatch} alt="stopwatch" className="w-6 h-6" />
                            <div className="text-white font-bold text-lg">
                              {isShowtimeSurvival ? formatTimeOrScore(scoreA, "time") : scoreA}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex-1 p-4 text-center">
                  <p className="text-gray-400">Aucun match pour ce round</p>
                  {isCreator && tournament.status !== 3 && (
                    <Button 
                      onClick={onGenerateMatches}
                      className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-black"
                      disabled={generatingMatches}
                    >
                      <PlayCircle size={16} className="mr-2" />
                      {generatingMatches ? "Génération..." : "GÉNÉRER LES MATCHS"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoundsList;
