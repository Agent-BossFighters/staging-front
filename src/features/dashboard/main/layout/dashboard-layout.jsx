import { DashboardCards, ScheduleCards } from '../cards/dashboard-cards';
import { XPProgressBar } from '../xp/xp-progress';

export function DashboardLayout() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Barre XP */}
        <div className="mb-6 md:mb-8 lg:hidden">
          <XPProgressBar />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {/* Première et deuxième colonnes */}
          <DashboardCards />
          
          {/* Troisième colonne */}
          <div className="order-last md:col-span-2 lg:col-span-1 flex flex-col h-auto lg:h-[37.5rem] justify-between">
            <div className="hidden lg:block">
              <XPProgressBar />
            </div>
            <ScheduleCards />
          </div>
        </div>
      </div>
    </div>
  );
} 