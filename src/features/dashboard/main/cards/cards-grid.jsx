import * as React from "react";
import { XPProgressBar } from '../xp/xp-progress';
import LockerCard from "./locker/locker-card";
import DataLabCard from "./datalab/datalab-card";
import TvToolsCard from "./tv-tools/tv-tools-card";
import ScheduleCard from "./schedule/schedule-card";
import DailyCard from "./daily/daily-card";
import MonthlyCard from "./monthly/monthly-card";
import PlayerMapCard from "./player-map/player-map-card";
import FightingCard from "./fighting/fighting-card";
import { Dashboard_Cards } from './dashboard-data';

// Composant pour les cartes du dashboard
function DashboardCards() {
  return (
    <>
      {/* Première colonne */}
      <div className="flex flex-col h-auto md:h-[37.5rem] space-y-6 md:space-y-8">
        <div className={Dashboard_Cards[0].size}>
          <LockerCard {...Dashboard_Cards[0]} />
        </div>
        <div className={Dashboard_Cards[1].size}>
          <TvToolsCard {...Dashboard_Cards[1]} />
        </div>
      </div>

      {/* Deuxième colonne */}
      <div className="flex flex-col h-auto md:h-[37.5rem] space-y-6 md:space-y-8">
        <div className={Dashboard_Cards[2].size}>
          <DataLabCard {...Dashboard_Cards[2]} />
        </div>
        <div className="flex flex-col space-y-6 md:space-y-8">
          <div className={Dashboard_Cards[3].size}>
            <ScheduleCard {...Dashboard_Cards[3]} />
          </div>
          <div className={Dashboard_Cards[4].size}>
            <FightingCard {...Dashboard_Cards[4]} />
          </div>
        </div>
      </div>

      {/* Troisième colonne */}
      <div className="order-last md:col-span-2 lg:col-span-1 flex flex-col h-auto lg:h-[37.5rem] justify-between">
        <div className="hidden lg:block">
          <XPProgressBar />
        </div>
        <div className="flex flex-col space-y-6 md:space-y-8">
          <div className={Dashboard_Cards[5].size}>
            <DailyCard {...Dashboard_Cards[5]} />
          </div>
          <div className={Dashboard_Cards[6].size}>
            <MonthlyCard {...Dashboard_Cards[6]} />
          </div>
          <div className={Dashboard_Cards[7].size}>
            <PlayerMapCard {...Dashboard_Cards[7]} />
          </div>
        </div>
      </div>
    </>
  );
}

export function CardsGrid() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Barre XP */}
        <div className="mb-6 md:mb-8 lg:hidden">
          <XPProgressBar />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          <DashboardCards />
        </div>
      </div>
    </div>
  );
} 