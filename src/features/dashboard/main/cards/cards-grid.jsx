// src/features/dashboard/CardsGrid.jsx
import React from "react";
import { XPProgress } from "@/features/dashboard/main/xp/xp-progress";
import LockerCard from "./locker-card";
import TvToolsCard from "./tv-tools-card";
import DataLabCard from "./datalab-card";
import ScheduleCard from "./schedule-card";
import FightingCard from "./fighting-card";
import DailyCard from "./daily-card";
import MonthlyCard from "./monthly-card";
import PlayerMapCard from "./player-map-card";

export function CardsGrid() {
  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-[20px] lg:hidden">
          <XPProgress />
        </div>
        <div className="grid grid-cols-3 grid-rows-8 gap-[20px]">
          <div className="row-span-6">
            <LockerCard />
          </div>
          <div className="row-span-4">
            <DataLabCard />
          </div>
          <div className="row-span-3 col-start-3 row-start-2">
            <DailyCard />
          </div>
          <div className="row-span-2 col-start-2 row-start-5">
            <ScheduleCard />
          </div>
          <div className="row-span-2 col-start-3 row-start-5">
            <MonthlyCard />
          </div>
          <div className="row-span-2 col-start-1 row-start-7">
            <TvToolsCard />
          </div>
          <div className="row-span-2 col-start-2 row-start-7">
            <FightingCard />
          </div>
          <div className="row-span-2 col-start-3 row-start-7">
            <PlayerMapCard />
          </div>
          <div className="col-start-3 row-start-1">
            <XPProgress />
          </div>
        </div>
      </div>
    </div>
  );
}
