import React from "react";
import { TableRowSkeleton } from "@shared/ui/skeleton";
import data from "@shared/data/rarities.json";

export default function ShowrunnerSkeleton() {
  return (
    <div className="overflow-x-auto max-w-[1200px]">
      <div className="w-full">
        {/* Header avec labels ultra-compressés */}
        <div className="flex w-full border-b pb-2">
          <div className="w-1/14 text-xs font-bold px-4">RARITY</div>
          <div className="w-1/14 text-xs font-bold px-4">ITEM</div>
          <div className="w-1/14 text-xs font-bold px-4">MAX&nbsp;<br/>SUPPLY</div>
          <div className="w-1/14 text-xs font-bold px-4">FLOOR&nbsp;<br/>PRICE</div>
          <div className="w-1/14 text-xs font-bold px-4">LVL&nbsp;<br/>MAX</div>
          <div className="w-1/14 text-xs font-bold px-4">MAX&nbsp;<br/>ENERGY</div>
          <div className="w-1/14 text-xs font-bold px-4">CRAFT&nbsp;<br/>TIME</div>
          <div className="w-1/14 text-xs font-bold px-4 text-destructive">NB&nbsp;BADGES&nbsp;<br/>RARITY-1</div>
          <div className="w-1/14 text-xs font-bold px-4 text-destructive">FLEX<br/>/CRAFT</div>
          <div className="w-1/14 text-xs font-bold px-4 text-destructive">SP.MARKS<br/>/CRAFT</div>
          <div className="w-1/14 text-xs font-bold px-4 text-destructive">CRAFTING<br/>COST</div>
          <div className="w-1/14 text-xs font-bold px-4">CHARGE&nbsp;<br/>TIME</div>
          <div className="w-1/14 text-xs font-bold px-4 text-destructive">FLEX<br/>/CHARGE</div>
          <div className="w-1/14 text-xs font-bold px-4 text-destructive">SP.MARKS<br/>/CHARGE</div>
        </div>
        
        {/* Skeleton rows */}
        <div className="py-2">
          {Array(data.rarities.length).fill(0).map((_, i) => (
            <TableRowSkeleton key={i} columns={14} className="mb-2 text-sm" />
          ))}
        </div>
      </div>
      <div className="text-sm text-gray-400 mt-2">
        Showrunner contract information according to the rarity
      </div>
    </div>
  );
} 