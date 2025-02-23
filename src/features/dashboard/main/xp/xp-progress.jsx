import * as React from "react";
import { cn } from "@/utils/lib/utils";
import { Progress } from "@ui/progress";
import { BackgroundUser } from "@img/index";
import { XP_DATA } from "./xp-data";

export function XPProgress() {
  const { currentLevel, nextLevel, currentXP, requiredXP } = XP_DATA;

  return (
    <div className="bg-[#1A1B1E] rounded-2xl p-3 border border-gray-800/50">
      <div className="flex items-center gap-5">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${BackgroundUser})` }}
          />
          <span className="text-white font-bold text-xl relative z-10 -mt-0.5">
            {currentLevel}
          </span>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[#FFD32A] font-bold text-[10px]">
              LVL {currentLevel}
            </span>
            <span className="text-[#FFD32A] font-bold text-[10px]">
              LVL {nextLevel}
            </span>
          </div>

          <Progress value={(currentXP / requiredXP) * 100} />

          <div className="flex justify-between items-center mt-0.5">
            <span className="text-gray-500 text-[8px]">{currentXP} XP</span>
            <span className="text-gray-500 text-[8px]">{requiredXP} XP</span>
          </div>
        </div>
      </div>

      <p className="text-[#FFD32A] text-[8px] text-center mt-3">
        Increase your level to 10 each month and take part in the Boss Fighters
        NFT raffle !
      </p>
    </div>
  );
}
