import { DashboardCards, ScheduleCards } from '../cards/dashboard-cards';
import { XPProgressBar } from '../xp/xp-progress';

export function DashboardLayout() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Barre XP mobile et tablette */}
        <div className="lg:hidden mb-12">
          <XPProgressBar className="h-[2.5rem]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          <DashboardCards />
          
          {/* Troisième colonne */}
          <div className="hidden lg:flex flex-col h-[37.5rem] justify-between">
            <XPProgressBar />
            <ScheduleCards />
          </div>
        </div>
      </div>
    </div>
  );
} 