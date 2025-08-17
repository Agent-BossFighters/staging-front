import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@shared/ui/button";
import { PlayCircle } from 'lucide-react';
import { formatTimeOrScore } from '../../utils/timeFormatters';
import { getTeamColor } from '../../constants/uiConfigs';
import { getBossName } from '../../utils/tournamentUtils';
import { headBoss, stopwatch } from '@img';

const Round = ({
  round,
  tournament,
  teams,
  roundMatches,
  isCreator,
  generatingMatches,
  isShowtimeSurvival,
  isEditingAllScores,
  allScores,
  onGenerateMatches,
  onAllScoreChange,
  editingMatch = null
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const matchesContainerRef = useRef(null);
  const scrollbarRef = useRef(null);

  useEffect(() => {
    const handleScrollEvent = () => {
      if (matchesContainerRef.current) {
        setScrollPosition(matchesContainerRef.current.scrollLeft);
      }
    };
    
    const containerRef = matchesContainerRef.current;
    if (containerRef) {
      containerRef.addEventListener('scroll', handleScrollEvent);
      return () => containerRef.removeEventListener('scroll', handleScrollEvent);
    }
  }, []);

  const handleScrollbarMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    
    const handleMouseMove = (moveEvent) => {
      if (!matchesContainerRef.current || !scrollbarRef.current) return;
      
      const scrollbarRect = scrollbarRef.current.getBoundingClientRect();
      const scrollbarWidth = scrollbarRect.width;
      const clickPositionRatio = (moveEvent.clientX - scrollbarRect.left) / scrollbarWidth;
      
      const boundedRatio = Math.max(0, Math.min(1, clickPositionRatio));
      const maxScroll = matchesContainerRef.current.scrollWidth - matchesContainerRef.current.clientWidth;
      
      requestAnimationFrame(() => {
        matchesContainerRef.current.scrollLeft = maxScroll * boundedRatio;
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    handleMouseMove(e);
  };

  const handleScrollbarTouchStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    
    const handleTouchMove = (moveEvent) => {
      if (!matchesContainerRef.current || !scrollbarRef.current) return;
      
      const touch = moveEvent.touches[0];
      const scrollbarRect = scrollbarRef.current.getBoundingClientRect();
      const scrollbarWidth = scrollbarRect.width;
      const touchPositionRatio = (touch.clientX - scrollbarRect.left) / scrollbarWidth;
      
      const boundedRatio = Math.max(0, Math.min(1, touchPositionRatio));
      const maxScroll = matchesContainerRef.current.scrollWidth - matchesContainerRef.current.clientWidth;
      
      requestAnimationFrame(() => {
        matchesContainerRef.current.scrollLeft = maxScroll * boundedRatio;
      });
    };
    
    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    // Gestion du touch initial
    const initialTouch = e.touches[0];
    const scrollbarRect = scrollbarRef.current.getBoundingClientRect();
    const scrollbarWidth = scrollbarRect.width;
    const touchPositionRatio = (initialTouch.clientX - scrollbarRect.left) / scrollbarWidth;
    const boundedRatio = Math.max(0, Math.min(1, touchPositionRatio));
    const maxScroll = matchesContainerRef.current.scrollWidth - matchesContainerRef.current.clientWidth;
    
    requestAnimationFrame(() => {
      matchesContainerRef.current.scrollLeft = maxScroll * boundedRatio;
    });
  };

  return (
    <div key={round} className="flex mb-3">
      <div className="bg-primary text-black font-bold flex items-center justify-center min-w-[60px] w-1/6 py-4 mr-4">
        <span className="text-md lg:text-xl text-center">ROUND {round}</span>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div
          ref={matchesContainerRef}
          className="flex overflow-x-auto pb-2"
          style={{ 
            maxWidth: "100%",
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {roundMatches.length > 0 ? (
            (teams ? [...teams].sort((a, b) => a.id - b.id) : []).map((team, index) => {
              const match = roundMatches.find(m => m.team_a_id === team.id);
              if (!match) return null;
              
              const scoreA = match.team_a_points || 0;
              const scoreB = match.team_b_points || 0;
              const bossName = getBossName(tournament);
              const teamColor = getTeamColor(index);
              
              return (
                <div key={`${round}-${team.id}`} className="min-w-[200px] flex-shrink-0 mx-5 last:mr-0 p-2 flex flex-col items-center justify-center">
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
                        <div className="flex flex-col items-center">
                          <div className="text-white text-xs mb-1">{isShowtimeSurvival ? "Time" : "Score"}</div>
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
                        
                        <div className="flex flex-col items-center">
                          <div className="text-red-400 text-xs mb-1">
                            {isShowtimeSurvival 
                              ? "Boss score" 
                              : "Lives left"}
                          </div>
                          <input
                            type="number"
                            min="0"
                            className="w-16 text-center bg-gray-600 text-white border border-gray-500 rounded p-1"
                            value={isShowtimeSurvival 
                              ? (allScores[match.id]?.boss_damage || 0)
                              : (allScores[match.id]?.lives_left || 0)}
                            onChange={(e) => onAllScoreChange(
                              match.id, 
                              isShowtimeSurvival ? 'boss_damage' : 'lives_left', 
                              e.target.value
                            )}
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
                      {scoreA > 0 && (
                        <div className="text-xs text-gray-400 mt-1">
                          {isShowtimeSurvival 
                            ? `Boss score: ${match.team_b_points || 0}` 
                            : `lives left: ${match.team_b_points || 0}`}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex-1 p-4 text-center">
              <p className="text-gray-400">No match for this round</p>
              {isCreator && tournament.status !== 3 && (
                <Button 
                  onClick={onGenerateMatches}
                  className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-black"
                  disabled={generatingMatches}
                >
                  <PlayCircle size={16} className="mr-2" />
                  {generatingMatches ? "Generating..." : "GENERATE MATCHES"}
                </Button>
              )}
            </div>
          )}
        </div>

        <div 
          ref={scrollbarRef}
          className="relative h-8 lg:h-6 mt-2 cursor-pointer"
          onMouseDown={handleScrollbarMouseDown}
          onTouchStart={handleScrollbarTouchStart}
        >
          <div className="absolute inset-0 bg-gray-700 rounded-full"></div>
          <div 
            className={`absolute h-full bg-gray-300 rounded-full ${isDragging ? 'bg-gray-400' : ''}`}
            style={{ 
              width: matchesContainerRef.current && matchesContainerRef.current.scrollWidth > matchesContainerRef.current.clientWidth
                ? `${Math.min(100, (matchesContainerRef.current.clientWidth / matchesContainerRef.current.scrollWidth) * 100)}%` 
                : '100%',
              left: matchesContainerRef.current && matchesContainerRef.current.scrollWidth > matchesContainerRef.current.clientWidth
                ? `${(scrollPosition / (matchesContainerRef.current.scrollWidth - matchesContainerRef.current.clientWidth)) * (100 - (matchesContainerRef.current.clientWidth / matchesContainerRef.current.scrollWidth) * 100)}%` 
                : '0%',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

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
  onAllScoreChange,
  editingMatch = null
}) => {
  const configuredRounds = parseInt(tournament?.rounds) || 1;
  const actualRounds = Math.max(configuredRounds, numberOfRounds);

  return (
    <div className="rounds-list text-md lg:text-xl">
      {Array.from({ length: actualRounds }).map((_, roundIndex) => {
        const round = roundIndex + 1;
        const roundMatches = groupedMatches[round] || [];
        
        return (
          <Round
            key={round}
            round={round}
            tournament={tournament}
            teams={teams}
            roundMatches={roundMatches}
            isCreator={isCreator}
            generatingMatches={generatingMatches}
            isShowtimeSurvival={isShowtimeSurvival}
            isEditingAllScores={isEditingAllScores}
            allScores={allScores}
            onGenerateMatches={onGenerateMatches}
            onAllScoreChange={onAllScoreChange}
            editingMatch={editingMatch}
          />
        );
      })}
    </div>
  );
};

export default RoundsList;
