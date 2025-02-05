// src/features/dashboard/CardsGrid.jsx
import React from "react";
import { XPProgress } from "@/features/dashboard/main/xp/xp-progress";
import LockerCard from "@/features/dashboard/main/cards/locker-card";
import TvToolsCard from "./tv-tools-card";
import DataLabCard from "./datalab-card";
import ScheduleCard from "./schedule-card";
import FightingCard from "./fighting-card";
import DailyCard from "./daily-card";
import MonthlyCard from "./monthly-card";
import PlayerMapCard from "./player-map-card";
import { BackgroundPreseason, CustomLeague, Locker, Playermap, Schedule } from "@img/index";

// Configuration des cartes
const cardsData = [
  {
    title: "LOCKER",
    description: "MANAGE YOUR TACTIC / ASSETS / BUILDS & DISCOUNTS",
    path: "/dashboard/locker",
    pattern: Locker,
    patternClassName: "w-[95%] h-[95%] object-contain mx-auto",
    size: "h-[400px] md:h-[450px] lg:h-[500px]",
    component: LockerCard,
  },
  {
    title: "TV TOOLS",
    description: "BE OVERLAY & COMMANDS",
    path: "/dashboard/tv-tools",
    size: "h-[170px]",
    component: TvToolsCard,
  },
  {
    title: "DATA LAB",
    description: "SIMULATE & IMPROVE",
    path: "/dashboard/datalab",
    backgroundImage: BackgroundPreseason,
    size: "h-[300px] md:h-[350px] lg:h-[400px]",
    component: DataLabCard,
  },
  {
    title: "SCHEDULE",
    description: "OPTIMIZE YOUR TIME ACCORDING TO YOUR PROFILE",
    path: "/dashboard/schedule",
    size: "h-[170px]",
    pattern: CustomLeague,
    patternClassName: "absolute inset-0 w-full h-full object-cover opacity-40",
    rightIcon: Schedule,
    component: ScheduleCard,
  },
  {
    title: "FIGHTING",
    description: "TOURNAMENTS & CUPS WITH CUSTOM RULES",
    path: "/dashboard/fighting",
    size: "h-[170px]",
    component: FightingCard,
  },
  {
    title: "DAILY",
    description: "COMPLETE YOUR DAILY DATA",
    path: "/dashboard/daily",
    size: "h-[330px]",
    component: DailyCard,
  },
  {
    title: "MONTHLY",
    description: "ACCOUNTING",
    path: "/dashboard/monthly",
    size: "h-[170px]",
    component: MonthlyCard,
  },
  {
    title: "PLAYER MAP",
    description: "INTUITION RP COMMUNITY MAP EXPLORER",
    path: "/dashboard/player-map",
    rightIcon: Playermap,
    size: "h-[170px]",
    component: PlayerMapCard,
  }
];

export { CardsGrid };

function CardsGrid() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* XP Progress pour mobile */}
        <div className="mb-[30px] lg:hidden">
          <XPProgress />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
          {/* Première colonne */}
          <div className="flex flex-col gap-[30px] h-[800px]">
            <div className="h-[610px]">
              {React.createElement(cardsData[0].component, {
                title: cardsData[0].title,
                description: cardsData[0].description,
                path: cardsData[0].path,
                pattern: cardsData[0].pattern,
                patternClassName: cardsData[0].patternClassName,
              })}
            </div>
            <div className="h-[160px]">
              {React.createElement(cardsData[1].component, {
                title: cardsData[1].title,
                description: cardsData[1].description,
                path: cardsData[1].path,
              })}
            </div>
          </div>
          {/* Deuxième colonne */}
          <div className="flex flex-col gap-[30px] h-[800px]">
            <div className="h-[510px]">
              {React.createElement(cardsData[2].component, {
                title: cardsData[2].title,
                description: cardsData[2].description,
                path: cardsData[2].path,
                backgroundImage: cardsData[2].backgroundImage,
              })}
            </div>
            <div className="flex flex-col gap-[30px] h-[370px]">
              <div className="h-[160px]">
                {React.createElement(cardsData[3].component, {
                  title: cardsData[3].title,
                  description: cardsData[3].description,
                  path: cardsData[3].path,
                  pattern: cardsData[3].pattern,
                  patternClassName: cardsData[3].patternClassName,
                  rightIcon: cardsData[3].rightIcon,
                })}
              </div>
              <div className="h-[160px]">
                {React.createElement(cardsData[4].component, {
                  title: cardsData[4].title,
                  description: cardsData[4].description,
                  path: cardsData[4].path,
                })}
              </div>
            </div>
          </div>
          {/* Troisième colonne */}
          <div className="order-last md:col-span-2 lg:col-span-1 flex flex-col gap-[30px] h-[800px]">
            {/* XP Progress pour desktop */}
            <div className="hidden lg:block h-[90px]">
              <div className="h-full">
                <XPProgress className="h-full" />
              </div>
            </div>
            <div className="flex flex-col gap-[30px] h-[680px]">
              <div className="h-[330px]">
                {React.createElement(cardsData[5].component, {
                  title: cardsData[5].title,
                  description: cardsData[5].description,
                  path: cardsData[5].path,
                })}
              </div>
            <div className="h-[170px]">
                {React.createElement(cardsData[6].component, {
                  title: cardsData[6].title,
                  description: cardsData[6].description,
                  path: cardsData[6].path,
                })}
              </div>
              <div className="h-[170px]">
                {React.createElement(cardsData[7].component, {
                  title: cardsData[7].title,
                  description: cardsData[7].description,
                  path: cardsData[7].path,
                  rightIcon: cardsData[7].rightIcon,
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
