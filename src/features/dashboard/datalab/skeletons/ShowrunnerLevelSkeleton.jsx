import React from "react";
import { Skeleton } from "@shared/ui/skeleton";

export default function ShowrunnerLevelSkeleton() {
  // Afficher 70 colonnes pour le skeleton
  const levels = Array.from({ length: 45 }, (_, i) => i + 1);
  
  // Mettre en évidence certains niveaux
  const highlightLevel = (level) => {
    return level === 1 || level === 5 || level === 10 || level === 15 || level === 20 || 
           level === 25 || level === 30 || level === 35 || level === 40 || level === 45;
  };

  return (
    <div className="w-full mt-8">
      <div className="w-full max-w-[1200px] overflow-x-auto">
        <div className="w-full">
          {/* Header */}
          <div className="flex w-full border-b pb-2">
            <div className="min-w-[60px] text-[10px] font-bold">LEVEL</div>
            {levels.map((level) => (
              <div
                key={level}
                className={`min-w-[25px] text-center text-[10px] font-bold ${
                  highlightLevel(level) ? "text-primary" : ""
                }`}
              >
                {level}
              </div>
            ))}
          </div>
          
          {/* Rows */}
          {["NB SP. MARKS", "SP. MARKS COST", "TOTAL SP. MARKS", "TOTAL COST"].map((rowTitle, rowIndex) => (
            <div key={rowIndex} className="flex w-full border-b py-2">
              <div className="min-w-[60px] text-[10px] font-bold">
                {rowTitle}
              </div>
              {levels.map((level) => (
                <div key={level} className="min-w-[25px] flex justify-center">
                  <Skeleton className="h-5 w-5" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground text-center">
        Showrunner contract level up costs
      </p>
    </div>
  );
} 