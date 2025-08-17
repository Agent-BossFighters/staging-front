import React, { useEffect, useRef } from 'react';
import { formatTimeOrScore } from '../../utils/timeFormatters';
import { WINNER_ICON } from '../../constants/uiConfigs';
import confetti from 'canvas-confetti';

const TeamRanking = ({ 
  tournament, 
  teamScores, 
  isShowtimeSurvival 
}) => {
  const winnerRowRef = useRef(null);

  // Fonction pour déclencher les confetti sur l'équipe gagnante
  const fireConfettiOnWinner = (duration = 7000) => {
    const el = winnerRowRef.current;
    if (!el || typeof confetti !== "function") return;
  
    const rect = el.getBoundingClientRect();
    const cx = (rect.left + rect.width / 2) / window.innerWidth;
    const cy = (rect.top + rect.height / 2) / window.innerHeight;
  
    const colors = ["#FFD32A", "#FFFFFF"];
    const animationEnd = Date.now() + duration;
  
    (function frame() {
      confetti({
        particleCount: 6,
        spread: 120,
        startVelocity: 40,
        ticks: 100,
        scalar: 0.8,
        colors,
        origin: { x: cx, y: cy }
      });
      if (Date.now() < animationEnd) requestAnimationFrame(frame);
    })();
  };

  // Déclencher les confetti quand le tournoi passe à "completed"
  useEffect(() => {
    if (tournament.status === "completed" && teamScores.length > 0) {
      // Délai pour s'assurer que le DOM est mis à jour
      setTimeout(() => {
        fireConfettiOnWinner();
      }, 500);
    }
  }, [tournament.status, teamScores.length]);
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
              <tr 
                key={scoreData.team.id} 
                className="border-b border-gray-700 gap-4"
                ref={index === 0 ? winnerRowRef : null}
              >
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
