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
            <tr className="border-b border-gray-700 gap-4">
              <th className="py-2 text-left">#</th>
              <th className="py-2 text-left min-w-[120px]">TEAM</th>
              <th className="py-2 text-left">TOTAL {isShowtimeSurvival ? "TIME" : "SCORE"}</th>
              <th className="py-2 text-left">
                {isShowtimeSurvival ? "BOSS SCORE" : "LIVES LEFT"}
              </th>
            </tr>
          </thead>
          <tbody>
            {teamScores.map((scoreData, index) => (
              <tr key={scoreData.team.id} className="border-b border-gray-700 gap-4">
                <td className="py-2 text-left">{index + 1}</td>
                <td className="py-2 truncate min-w-[120px]" title={scoreData.team.name}>
                  {scoreData.team.name.length < 15 ? scoreData.team.name : scoreData.team.name.slice(0, 15) + "..."}
                  {tournament.status === "completed" && index === 0 && (
                    <span className="ml-2 text-primary">{WINNER_ICON}</span>
                  )}
                </td>
                <td className="py-2 text-left font-bold">
                  {formatTimeOrScore(scoreData.mainPoints, isShowtimeSurvival ? "time" : "score")}
                </td>
                <td className="py-2 text-left">
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
