import React from "react";
import { TableRowSkeleton } from "@shared/ui/skeleton";
import data from "@shared/data/rarities.json";

export default function BadgesPricesSkeleton() {
  return (
    <div className="max-w-full">
      <div className="w-full overflow-x-auto">
        <div className="w-full">
          {/* Header avec labels compressés */}
          <div className="flex w-full border-b pb-2">
            <div className="w-1/8 text-xs px-2 font-bold">RARITY</div>
            <div className="w-1/8 text-xs px-2 font-bold">FLOOR&nbsp;PRICE</div>
            <div className="w-1/8 text-xs px-2 font-bold">FULL&nbsp;RECHARGE&nbsp;PRICE</div>
            <div className="w-1/8 text-xs px-2 font-bold text-destructive">TOTAL&nbsp;COST</div>
            <div className="w-1/8 text-xs px-2 font-bold">IN&nbsp;GAME&nbsp;TIME</div>
            <div className="w-1/8 text-xs px-2 font-bold text-accent">$BFT/MAX&nbsp;RECHARGE</div>
            <div className="w-1/8 text-xs px-2 font-bold text-accent">$BFT&nbsp;VALUE($)</div>
            <div className="w-1/8 text-xs px-2 font-bold text-accent">NB&nbsp;CHARGES&nbsp;ROI</div>
          </div>
          
          {/* Skeleton rows */}
          <div className="py-2">
            {Array(data.rarities.length).fill(0).map((_, i) => (
              <TableRowSkeleton key={i} columns={8} className="mb-2" />
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <div className="flex flex-col items-center mr-4">
          <h3 className="text-md font-bold mb-2">$BFT BONUS MULTIPLIER</h3>
          <div className="h-8 w-20 flex justify-center">
            <div className="border-2 border-gray-500 h-8 w-20 flex items-center justify-center">
              <span className="font-bold">1</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <h3 className="text-md font-bold mb-2">SLOT(S) USED</h3>
          <div className="h-8 w-20 flex justify-center">
            <div className="border-2 border-gray-500 h-8 w-20 flex items-center justify-center">
              <span className="font-bold">1</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-400 mt-4">
        Badge charges ROI according to $BFT bonus multiplier and slot(s) used
      </div>
    </div>
  );
} 