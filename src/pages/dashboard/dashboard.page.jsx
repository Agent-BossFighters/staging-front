import { DashboardCard } from '@ui/DashboardCard';
import { XPProgress } from '@ui/progress';
import { BackgroundPreseason, BgToken, Locker } from '@img/index';

const DASHBOARD_CARDS = [
  {
    title: "LOCKER",
    description: "MANAGE YOUR TACTIC / ASSETS / BUILDS & DISCOUNTS",
    path: "/dashboard/vestiary",
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

const SCHEDULE_CARDS = [
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

const XPData = {
  currentLevel: 9,
  nextLevel: 10,
  currentXP: 8250,
  requiredXP: 10000
};

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Barre XP mobile et tablette */}
        <div className="lg:hidden mb-12">
          <div className="h-[2.5rem]">
            <XPProgress {...XPData} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {/* Première colonne */}
          <div className="flex flex-col h-auto md:h-[37.5rem] space-y-6 md:space-y-8">
            {DASHBOARD_CARDS.slice(0, 2).map((card) => (
              <div key={card.path} className={card.size}>
                <DashboardCard {...card} />
              </div>
            ))}
          </div>

          {/* Deuxième colonne */}
          <div className="flex flex-col h-auto md:h-[37.5rem] space-y-6 md:space-y-8">
            <div className={DASHBOARD_CARDS[2].size}>
              <DashboardCard {...DASHBOARD_CARDS[2]} />
            </div>
            <div className="flex flex-col space-y-6 md:space-y-8">
              {DASHBOARD_CARDS.slice(3).map((card) => (
                <div key={card.path} className={card.size}>
                  <DashboardCard {...card} />
                </div>
              ))}
            </div>
          </div>

          {/* Troisième colonne */}
          <div className="hidden lg:flex flex-col h-[37.5rem] justify-between">
            <div>
              <XPProgress {...XPData} />
            </div>
            <div className="flex flex-col space-y-6 md:space-y-8">
              {SCHEDULE_CARDS.map((card) => (
                <div key={card.path} className={card.size}>
                  <DashboardCard {...card} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
