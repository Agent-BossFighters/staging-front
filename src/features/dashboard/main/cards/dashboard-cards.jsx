import { DashboardCard } from '@ui/DashboardCard';
import { DASHBOARD_CARDS } from './card-data';

export function DashboardCards() {
  return (
    <>
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
    </>
  );
} 