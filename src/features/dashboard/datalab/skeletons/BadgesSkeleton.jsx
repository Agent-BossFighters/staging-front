import React from "react";
import { TableRowSkeleton } from "@shared/ui/skeleton";
import data from "@shared/data/rarities.json";

export default function BadgesSkeleton() {
  return (
    <div>

      <div className="w-full overflow-x-auto">
        <div className="w-full">
          {/* Header avec labels compressés comme dans l'interface réelle */}
          <div className="flex w-full border-b pb-2">
            <div className="w-1/15 text-xs px-2 font-bold">RARITY</div>
            <div className="w-1/15 text-xs px-2 font-bold">ITEM</div>
            <div className="w-1/15 text-xs px-2 font-bold">MAX&nbsp;SUPPLY</div>
            <div className="w-1/15 text-xs px-2 font-bold">FLOOR&nbsp;PRICE</div>
            <div className="w-1/15 text-xs px-2 font-bold">EFFICIENCY</div>
            <div className="w-1/15 text-xs px-2 font-bold">RATIO</div>
            <div className="w-1/15 text-xs px-2 font-bold">MAX&nbsp;ENERGY</div>
            <div className="w-1/15 text-xs px-2 font-bold">TIME&nbsp;TO&nbsp;CHARGE</div>
            <div className="w-1/15 text-xs px-2 font-bold">IN&nbsp;GAME&nbsp;TIME</div>
            <div className="w-1/15 text-xs px-2 font-bold text-destructive">MAX&nbsp;CHARGE&nbsp;COST</div>
            <div className="w-1/15 text-xs px-2 font-bold text-destructive">COST/HOUR</div>
            <div className="w-1/15 text-xs px-2 font-bold text-accent">BFT/MINUTE</div>
            <div className="w-1/15 text-xs px-2 font-bold text-accent">BFT/CHARGE</div>
            <div className="w-1/15 text-xs px-2 font-bold text-accent">BFT&nbsp;VALUE</div>
            <div className="w-1/15 text-xs px-2 font-bold text-accent">ROI</div>
          </div>
          
          {/* Skeleton rows */}
          <div className="py-2">
            {Array(data.rarities.length).fill(0).map((_, i) => (
              <TableRowSkeleton key={i} columns={15} className="mb-2" />
            ))}
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-400 mt-2">
        Badge informations according to slot(s) used
      </div>
    </div>
  );
} 