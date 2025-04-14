import React, { useEffect } from 'react';
import { formatTimeOrScore } from '../../utils/timeFormatters';
import { WINNER_ICON } from '../../constants/uiConfigs';

const TeamRanking = ({ 
  tournament, 
  teamScores, 
  isShowtimeSurvival 
}) => {
  return (
    <div className="flex flex-col">
      <div className="bg-primary text-black font-bold p-3">
        RANKING
      </div>
      <div className="bg-gray-900 p-4 mt-1">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 text-center">#</th>
              <th className="py-2 text-left">TEAM</th>
              <th className="py-2 text-right">TOTAL {isShowtimeSurvival ? "TEMPS" : "DAMAGE"}</th>
              <th className="py-2 text-right">
                {isShowtimeSurvival ? "BOSS DAMAGE" : "LIVES LEFT"}
              </th>
            </tr>
          </thead>
          <tbody>
            {teamScores.map((scoreData, index) => (
              <tr key={scoreData.team.id} className="border-b border-gray-700">
                <td className="py-2 text-center">{index + 1}</td>
                <td className="py-2 truncate">
                  {scoreData.team.name}
                  {tournament.status === 3 && index === 0 && (
                    <span className="ml-2 text-yellow-400">{WINNER_ICON}</span>
                  )}
                </td>
                <td className="py-2 text-right font-bold">
                  {formatTimeOrScore(scoreData.mainPoints, isShowtimeSurvival ? "time" : "score")}
                </td>
                <td className="py-2 text-right">
                  {isShowtimeSurvival 
                    ? scoreData.bossPoints 
                    : scoreData.bossPoints}
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
