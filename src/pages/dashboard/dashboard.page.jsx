import { DashboardCard } from '@ui/DashboardCard';
import { XPProgressCard } from '@ui/XPProgressCard';

// Images de fond pour les cards
const itemsIcon = new URL('../../assets/img/items.png', import.meta.url).href;
const datalabBg = new URL('../../assets/img/background-preseason.png', import.meta.url).href;
const farmingBg = new URL('../../assets/img/bg-token.png', import.meta.url).href;

// Pour déboguer
console.log('Image URL:', itemsIcon);

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Barre XP mobile et tablette */}
        <div className="lg:hidden mb-12">
          <div className="h-[2.5rem]">
            <XPProgressCard
              currentLevel={9}
              nextLevel={10}
              currentXP={8250}
              requiredXP={10000}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Première colonne - 2 cards */}
          <div className="flex flex-col h-auto md:h-[37.5rem]">
            <div className="h-[18.75rem] md:h-[25.75rem] mb-4 md:mb-0">
              <DashboardCard
                title="LOCKER"
                description="MANAGE YOUR TACTIC / ASSETS / BUILDS & DISCOUNTS"
                path="/dashboard/vestiary"
                backgroundImage={itemsIcon}
              />
            </div>
            <div className="h-[9.375rem] md:h-[10rem] mt-auto">
              <DashboardCard
                title="TV TOOLS"
                description="BE OVERLAY & COMMANDS"
                path="/dashboard/tv-tools"
                icon="/icons/tv.png"
              />
            </div>
          </div>

          {/* Deuxième colonne */}
          <div className="flex flex-col h-auto md:h-[37.5rem]">
            <div className="h-[15.625rem] md:h-[25.75rem] mb-8 md:mb-0">
              <DashboardCard
                title="DATA LAB"
                description="SIMULATE & IMPROVE"
                path="/dashboard/datalab"
                backgroundImage={datalabBg}
              />
            </div>
            <div className="flex flex-col gap-4 md:mt-4">
              <div className="h-[9.375rem] md:h-[11.5rem]">
                <DashboardCard
                  title="SCHEDULE"
                  description="OPTIMIZE YOUR TIME ACCORDING TO YOUR PROFILE"
                  path="/dashboard/farming"
                  backgroundImage={farmingBg}
                />
              </div>
              <div className="h-[9.375rem] md:h-[10rem]">
                <DashboardCard
                  title="FIGHTING"
                  description="TOURNAMENTS & CUPS WITH CUSTOM RULES"
                  path="/dashboard/fighting"
                  icon="/icons/fighting.png"
                />
              </div>
            </div>
          </div>

          {/* Troisième colonne - mobile/tablette */}
          <div className="flex flex-col h-auto md:h-[37.5rem] lg:hidden">
            <div className="flex flex-col gap-4">
              <div className="h-[9.375rem] md:h-[10rem]">
                <DashboardCard
                  title="DAILY"
                  description="COMPLETE YOUR DAILY DATA"
                  path="/dashboard/farming/daily"
                  icon="/icons/daily.png"
                />
              </div>
              <div className="h-[9.375rem] md:h-[10rem]">
                <DashboardCard
                  title="MONTHLY"
                  description="ACCOUNTING"
                  path="/dashboard/farming/monthly"
                  icon="/icons/monthly.png"
                />
              </div>
              <div className="h-[9.375rem] md:h-[10rem]">
                <DashboardCard
                  title="PLAYER MAP"
                  description="INTUITION RP COMMUNITY MAP EXPLORER"
                  path="/dashboard/player-map"
                  icon="/icons/map.png"
                />
              </div>
            </div>
          </div>

          {/* Version desktop de la troisième colonne reste inchangée */}
          <div className="hidden lg:flex flex-col h-[37.5rem]">
            <div>
              <div className="h-[2.5rem]">
                <XPProgressCard
                  currentLevel={9}
                  nextLevel={10}
                  currentXP={8250}
                  requiredXP={10000}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-12">
              <div className="h-[9.375rem] md:h-[10rem]">
                <DashboardCard
                  title="DAILY"
                  description="COMPLETE YOUR DAILY DATA"
                  path="/dashboard/farming/daily"
                  icon="/icons/daily.png"
                />
              </div>
              <div className="h-[9.375rem] md:h-[10rem]">
                <DashboardCard
                  title="MONTHLY"
                  description="ACCOUNTING"
                  path="/dashboard/farming/monthly"
                  icon="/icons/monthly.png"
                />
              </div>
              <div className="h-[9.375rem] md:h-[10rem]">
                <DashboardCard
                  title="PLAYER MAP"
                  description="INTUITION RP COMMUNITY MAP EXPLORER"
                  path="/dashboard/player-map"
                  icon="/icons/map.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
