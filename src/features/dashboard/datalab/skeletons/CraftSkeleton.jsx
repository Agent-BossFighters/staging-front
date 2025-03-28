import React from "react";
import { TableRowSkeleton } from "@shared/ui/skeleton";
import data from "@shared/data/rarities.json";

export default function CraftSkeleton() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="w-1/2">
        {/* Header */}
        <div className="flex w-full border-b pb-2">
          <div className="flex-1 font-bold">RARITY</div>
          <div className="flex-1 font-bold">SUPPLY</div>
          <div className="flex-1 font-bold">
            NB PREVIOUS
            <br />
            RARITY ITEM
          </div>
          <div className="flex-1 font-bold">BFT</div>
          <div className="flex-1 font-bold">
            BFT
            <br />
            COST
          </div>
          <div className="flex-1 font-bold text-accent">
            SP.MARKS
            <br />
            /REWARD
          </div>
          <div className="flex-1 font-bold text-accent">
            SP.MARKS
            <br />
            /VALUE
          </div>
        </div>
        
        {/* Skeleton rows */}
        <div className="py-2">
          {Array(data.rarities.length).fill(0).map((_, i) => (
            <TableRowSkeleton key={i} columns={7} className="mb-2" />
          ))}
        </div>
      </div>
      <div className="text-sm text-gray-400 mt-2">
        Craft requirements and SP.MARKS rewards according to rarity level
      </div>
    </div>
  );
} 