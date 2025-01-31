import { BackgroundPreseason, BgToken, Locker } from '@img/index';

export const DASHBOARD_CARDS = [
  {
    title: "LOCKER",
    description: "MANAGE YOUR TACTIC / ASSETS / BUILDS & DISCOUNTS",
    path: "/dashboard/locker",
    backgroundimage: Locker,
    size: "h-[18.75rem] md:h-[25.75rem]"
  },
  {
    title: "TV TOOLS",
    description: "BE OVERLAY & COMMANDS",
    path: "/dashboard/tv-tools",
    size: "h-[9.375rem] md:h-[10rem]"
  },
  {
    title: "DATA LAB",
    description: "SIMULATE & IMPROVE",
    path: "/dashboard/datalab",
    backgroundimage: BackgroundPreseason,
    size: "h-[15.625rem] md:h-[25.75rem]"
  },
  {
    title: "SCHEDULE",
    description: "OPTIMIZE YOUR TIME ACCORDING TO YOUR PROFILE",
    path: "/dashboard/farming",
    backgroundimage: BgToken,
    size: "h-[9.375rem] md:h-[11.5rem]"
  },
  {
    title: "FIGHTING",
    description: "TOURNAMENTS & CUPS WITH CUSTOM RULES",
    path: "/dashboard/fighting",
    size: "h-[9.375rem] md:h-[10rem]"
  }
];

export const SCHEDULE_CARDS = [
  {
    title: "DAILY",
    description: "COMPLETE YOUR DAILY DATA",
    path: "/dashboard/farming/daily",
    size: "h-[9.375rem] lg:h-[9.30rem]"
  },
  {
    title: "MONTHLY",
    description: "ACCOUNTING",
    path: "/dashboard/farming/monthly",
    size: "h-[9.375rem] lg:h-[9.30rem]"
  },
  {
    title: "PLAYER MAP",
    description: "INTUITION RP COMMUNITY MAP EXPLORER",
    path: "/dashboard/player-map",
    size: "h-[9.375rem] lg:h-[9.30rem]"
  }
]; 