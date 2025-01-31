import { DashboardCard } from '@ui/DashboardCard';
import { SCHEDULE_CARDS } from './card-data';

export function ScheduleCards() {
  return (
    <div className="flex flex-col space-y-6 md:space-y-8">
      {SCHEDULE_CARDS.map((card) => (
        <div key={card.path} className={card.size}>
          <DashboardCard {...card} />
        </div>
      ))}
    </div>
  );
} 