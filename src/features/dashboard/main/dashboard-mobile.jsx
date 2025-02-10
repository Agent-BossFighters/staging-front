import React from "react";
import { XPProgress } from "@/features/dashboard/main/xp/xp-progress";
import { RewardsPattern1, RewardsPattern2, Vector, Monthly, Contract, Schedule, Fighting, TvTools, Playermap } from "@img/index";

const MobileCard = ({ title, description, icon, pattern }) => (
  <div className="bg-[#1A1B1E] rounded-2xl p-6 relative overflow-hidden">
    <img 
      src={pattern} 
      alt="" 
      className="absolute inset-0 w-full h-full"
    />
    <div className="flex items-center gap-4 relative z-10">
      <img 
        src={icon}
        alt="" 
        className={`w-16 h-16 object-contain ${icon === Playermap ? 'scale-125' : ''}`}
      />
      <div className="flex-1">
        <h2 className="font-bold text-2xl mb-1 text-[#FFD32A]">
          {title}
        </h2>
        <p className="text-gray-300 text-sm">
          {description}
        </p>
      </div>
    </div>
  </div>
);

export function DashboardMobile() {
  const cards = [
    {
      title: "DAILY",
      description: "COMPLETE YOUR DAILY DATA",
      icon: Vector,
      pattern: RewardsPattern2,
      path: "/dashboard/daily"
    },
    {
      title: "MONTHLY",
      description: "ACCOUNTING",
      icon: Monthly,
      pattern: RewardsPattern1,
      path: "/dashboard/monthly"
    },
    {
      title: "LOCKER",
      description: "MANAGE YOUR TACTIC / ASSETS / BUILDS & DISCOUNTS",
      icon: Contract,
      pattern: RewardsPattern2,
      path: "/dashboard/locker"
    },
    {
      title: "DATA LAB",
      description: "SIMULATE & IMPROVE",
      icon: Vector,
      pattern: RewardsPattern1,
      path: "/dashboard/datalab"
    },
    {
      title: "SCHEDULE",
      description: "OPTIMIZE YOUR TIME ACCORDING TO YOUR PROFILE",
      icon: Schedule,
      pattern: RewardsPattern2,
      path: "/dashboard/schedule"
    },
    {
      title: "TV TOOLS",
      description: "BE OVERLAY & COMMANDS",
      icon: TvTools,
      pattern: RewardsPattern1,
      path: "/dashboard/tv-tools"
    },
    {
      title: "FIGHTING",
      description: "TOURNAMENTS & CUPS WITH CUSTOM RULES",
      icon: Fighting,
      pattern: RewardsPattern2,
      path: "/dashboard/fighting"
    },
    {
      title: "PLAYER MAP",
      description: "INTUITION RP COMMUNITY MAP EXPLORER",
      icon: Playermap,
      pattern: RewardsPattern1,
      path: "/dashboard/player-map"
    }
  ];

  return (
    <div className="block lg:hidden">
      <div className="p-4 space-y-4">
        <div className="mb-4">
          <XPProgress />
        </div>
        <div className="space-y-4">
          {cards.map((card, index) => (
            <MobileCard key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
} 