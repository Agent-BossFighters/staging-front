import React from "react";
import { Skeleton, TableRowSkeleton } from "@shared/ui/skeleton";

export default function SlotSkeleton() {
  return (
    <div>
      <div className="w-1/2 overflow-x-auto">
        <div className="w-full">
          {/* Header */}
          <div className="flex w-full border-b pb-2">
            <div className="flex-1 text-xs font-bold">SLOT</div>
            <div className="flex-1 text-xs font-bold text-destructive">
              NB FLEX
            </div>
            <div className="flex-1 text-xs font-bold text-destructive">
              FLEX COST
            </div>
            <div className="flex-1 text-xs font-bold">
              BONUS BFT/SLOT
            </div>
            <div className="flex-1 text-xs font-bold">
              NORMAL BFT/BADGE
            </div>
            <div className="flex-1 text-xs font-bold">
              BONUS BFT/BADGE
            </div>
          </div>
          
          {/* Skeleton rows */}
          <div className="py-2">
            {Array(4).fill(0).map((_, i) => (
              <TableRowSkeleton key={i} columns={6} className="mb-2" />
            ))}
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-400 mt-2">
        Normal and bonus part $BFT displayed for a basic common badge
      </div>
    </div>
  );
} 