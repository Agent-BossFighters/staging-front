import React from 'react';

export function XPProgressCard({ currentLevel, nextLevel, currentXP, requiredXP }) {
  const progress = (currentXP / requiredXP) * 100;

  return (
    <div className="bg-[#1A1B1E] rounded-2xl p-3 border border-gray-800/50">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[#FFD32A] font-bold text-sm">Level {currentLevel}</span>
        <span className="text-gray-500 text-xs">Level {nextLevel}</span>
      </div>
      
      <div className="relative h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="absolute left-0 top-0 h-full bg-[#FFD32A] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center mt-1">
        <span className="text-gray-500 text-xs">{currentXP} XP</span>
        <span className="text-gray-500 text-xs">{requiredXP} XP</span>
      </div>
    </div>
  );
} 