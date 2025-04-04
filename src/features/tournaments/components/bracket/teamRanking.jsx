import React from 'react';
import { formatTimeOrScore } from '../../utils/timeFormatters';
import { WINNER_ICON } from '../../constants/uiConfigs';

const TeamRanking = ({ 
  tournament, 
  teamScores, 
  isShowtimeSurvival 
}) => {
  return (
    <div className="flex flex-col">
      <div className="bg-primary text-black font-bold p-3 rounded-t-md text-center">
        RANKING
      </div>
      <div className="flex-1 bg-blue-900 bg-opacity-50 p-4 rounded-b-md">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 text-left">#</th>
              <th className="py-2 text-left">ÉQUIPE</th>
              {/* Afficher les colonnes de rounds même pour un seul round */}
              {(() => {
                // Vérification du nombre de rounds (défaut à 1 si non défini)
                const roundsNum = parseInt(tournament?.rounds) || 1;
                
                return Array.from({length: roundsNum}, (_, i) => (
                  <th key={i} className="py-2 text-center">R{i+1}</th>
                ));
              })()}
              <th className="py-2 text-right">{isShowtimeSurvival ? "TEMPS" : "SCORE"}</th>
            </tr>
          </thead>
          <tbody>
            {teamScores.map((scoreData, index) => (
              <tr key={scoreData.team.id} className={index === 0 ? 'bg-yellow-600 bg-opacity-20' : ''}>
                <td className="py-2">{index + 1}</td>
                <td className="py-2 truncate max-w-[150px]">
                  {scoreData.team.name}
                  {tournament.status === 3 && index === 0 && (
                    <span className="ml-2 text-yellow-400">{WINNER_ICON} Winner</span>
                  )}
                </td>
                {/* Afficher les scores par round pour tous les rounds */}
                {(() => {
                  // Vérification du nombre de rounds (défaut à 1 si non défini)
                  const roundsNum = parseInt(tournament?.rounds) || 1;
                  
                  return Array.from({length: roundsNum}, (_, i) => {
                    const roundNum = i + 1;
                    const roundScore = scoreData.roundScores[roundNum] || { mainPoints: 0 };
                    return (
                      <td key={i} className="py-2 text-center">
                        <span className="font-medium">
                          {isShowtimeSurvival 
                            ? formatTimeOrScore(roundScore.mainPoints, "time") 
                            : formatTimeOrScore(roundScore.mainPoints, "score")}
                        </span>
                      </td>
                    );
                  });
                })()}
                <td className="py-2 text-right">
                  <span className="font-bold">
                    {isShowtimeSurvival 
                      ? formatTimeOrScore(scoreData.mainPoints, "time") 
                      : formatTimeOrScore(scoreData.mainPoints, "score")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamRanking;
