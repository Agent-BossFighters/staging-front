import * as React from "react";
import LockerCard from "./locker/locker-card";
import DataLabCard from "./datalab/datalab-card";
import TvToolsCard from "./tv-tools/tv-tools-card";
import ScheduleCard from "./schedule/schedule-card";
import DailyCard from "./daily/daily-card";
import MonthlyCard from "./monthly/monthly-card";
import PlayerMapCard from "./player-map/player-map-card";
import FightingCard from "./fighting/fighting-card";
import { DASHBOARD_CARDS, SCHEDULE_CARDS } from './dashboard-data';

// Composant pour les cartes principales
export function DashboardCards() {
  return (
    <>
      {/* Première colonne */}
      <div className="flex flex-col h-auto md:h-[37.5rem] space-y-6 md:space-y-8">
        <div className={DASHBOARD_CARDS[0].size}>
          <LockerCard {...DASHBOARD_CARDS[0]} />
        </div>
        <div className={DASHBOARD_CARDS[1].size}>
          <TvToolsCard {...DASHBOARD_CARDS[1]} />
        </div>
      </div>

      {/* Deuxième colonne */}
      <div className="flex flex-col h-auto md:h-[37.5rem] space-y-6 md:space-y-8">
        <div className={DASHBOARD_CARDS[2].size}>
          <DataLabCard {...DASHBOARD_CARDS[2]} />
        </div>
        <div className="flex flex-col space-y-6 md:space-y-8">
          <div className={DASHBOARD_CARDS[3].size}>
            <ScheduleCard {...DASHBOARD_CARDS[3]} />
          </div>
          <div className={DASHBOARD_CARDS[4].size}>
            <FightingCard {...DASHBOARD_CARDS[4]} />
          </div>
        </div>
      </div>
    </>
  );
}

// Composant pour les cartes de planning
export function ScheduleCards() {
  return (
    <div className="flex flex-col space-y-6 md:space-y-8">
      <div className={SCHEDULE_CARDS[0].size}>
        <DailyCard {...SCHEDULE_CARDS[0]} />
      </div>
      <div className={SCHEDULE_CARDS[1].size}>
        <MonthlyCard {...SCHEDULE_CARDS[1]} />
      </div>
      <div className={SCHEDULE_CARDS[2].size}>
        <PlayerMapCard {...SCHEDULE_CARDS[2]} />
      </div>
    </div>
  );
} 