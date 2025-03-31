import React from "react";
import { Skeleton } from "@shared/ui/skeleton";

export default function SlotCostSkeleton() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-1 gap-1">
        {/* Header avec les labels plus petits */}
        <div className="grid grid-cols-8 gap-1 border-b pb-2">
          <div className="text-xs font-bold">NB SLOT(S) UNLOCKED</div>
          <div className="text-xs font-bold text-destructive">TOTAL FLEX</div>
          <div className="text-xs font-bold text-destructive">TOTAL COST</div>
          <div className="text-xs font-bold">TOTAL BONUS $BFT</div>
          <div className="text-xs font-bold">NB TOKENS ROI</div>
          <div className="text-xs font-bold">NB CHARGES ROI (1.0 MULTIPLIER)</div>
          <div className="text-xs font-bold">NB CHARGES ROI (2.0 MULTIPLIER)</div>
          <div className="text-xs font-bold">NB CHARGES ROI (3.0 MULTIPLIER)</div>
        </div>
        
        {/* Skeleton rows */}
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="grid grid-cols-8 gap-1 py-1 items-center">
            <div>
              <Skeleton className="h-6 w-full" />
            </div>
            <div>
              <Skeleton className="h-6 w-full" />
            </div>
            <div>
              <Skeleton className="h-6 w-full" />
            </div>
            <div>
              <Skeleton className="h-6 w-full" />
            </div>
            <div>
              <Skeleton className="h-6 w-full" />
            </div>
            <div>
              <Skeleton className="h-6 w-full" />
            </div>
            <div>
              <Skeleton className="h-6 w-full" />
            </div>
            <div>
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end mt-2">
        <div className="mr-2">
          <span className="text-sm font-bold">BADGE RARITY</span>
        </div>
        <div>
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
      </div>
      
      <div className="text-sm text-gray-400 mt-2">
        Nb charges ROI according to the badge rarity
      </div>
    </div>
  );
} 