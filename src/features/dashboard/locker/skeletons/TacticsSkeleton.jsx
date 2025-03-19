import React from "react";
import { MyTactic } from "@img/index";
import { Skeleton, SelectSkeleton, ButtonSkeleton } from "@ui/skeleton";

export default function TacticsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-9">
        {/* MAX ITEM RARITY */}
        <div className="flex flex-col">
          <h3 className="text-l font-bold whitespace-nowrap leading-tight pb-[8px]">
            MAX ITEM RARITY
            <br />
            TO SHOW
          </h3>
          <SelectSkeleton className="w-[200px]" />
        </div>
        
        {/* FAVORITE FLEX PACK */}
        <div className="flex flex-col">
          <h3 className="text-l font-bold whitespace-nowrap leading-tight pb-[8px]">
            FAVORITE
            <br />
            FLEX PACK
          </h3>
          <SelectSkeleton className="w-[200px]" />
        </div>
        
        {/* BADGE SLOTS */}
        <div className="flex flex-col">
          <h3 className="text-l font-bold whitespace-nowrap leading-tight pb-[8px]">
            BADGE SLOT(S)
            <br />
            UNLOCKED
          </h3>
          <SelectSkeleton className="w-[70px]" />
        </div>
        
        {/* STREAMER MODE */}
        <div className="flex flex-col">
          <h3 className="text-l font-bold whitespace-nowrap leading-tight pb-[8px]">
            STREAMER
            <br />
            MODE
          </h3>
          <SelectSkeleton className="w-[80px]" />
        </div>
        
        {/* SAVE BUTTON */}
        <div className="flex flex-col justify-end">
          <ButtonSkeleton />
        </div>
      </div>
    </div>
  );
} 