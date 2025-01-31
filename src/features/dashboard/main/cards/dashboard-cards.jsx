import * as React from "react";
import { Link } from 'react-router-dom';
import { cn } from "@/utils/lib/utils";
import {
  Card,
  CardBackground,
  CardPattern,
  CardContent,
  CardTitle,
  CardDescription,
} from "@ui/Card";

import {
  RewardsPattern1,
  RewardsPattern2,
  Vector,
  Monthly,
  Playermap,
  Schedule,
  CustomLeague,
  Fighting,
  TvTools,
  BackgroundLocker
} from "@img/index";

import { DASHBOARD_CARDS, SCHEDULE_CARDS } from './dashboard-data';

// Composant de carte spécifique au dashboard
const DashboardCard = React.forwardRef(({ className, title, description, path, backgroundimage, ...props }, ref) => {
  const pathEnd = path.split('/').pop();
  const isLocker = pathEnd === 'locker';
  const isDataLab = pathEnd === 'datalab';
  const isDaily = pathEnd === 'daily';
  const isMonthly = pathEnd === 'monthly';
  const isPlayerMap = pathEnd === 'player-map';
  const isSchedule = pathEnd === 'farming';
  const isFighting = pathEnd === 'fighting';
  const isTvTools = pathEnd === 'tv-tools';

  const getPatternForCard = () => {
    if (isDaily) return Vector;
    if (isMonthly) return Monthly;
    if (isPlayerMap) return Playermap;
    if (isSchedule) return Schedule;
    if (isFighting) return Fighting;
    if (isTvTools) return TvTools;
    return null;
  };

  const pattern = getPatternForCard();

  return (
    <Link to={path} className="block h-full">
      <Card ref={ref} className={cn("hover:bg-gradient-to-br hover:from-yellow-500/10 hover:to-yellow-900/10 hover:scale-[1.02] hover:border-gray-700/50", className)} {...props}>
        {isLocker && (
          <>
            <CardBackground 
              image={BackgroundLocker}
              className="absolute inset-0 opacity-20" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
            <CardBackground 
              image={backgroundimage} 
              className="w-[90%] h-[90%] m-auto top-[85%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-contain"
            />
          </>
        )}
        {isDataLab && backgroundimage && (
          <CardBackground 
            image={backgroundimage}
            className="absolute inset-0 bg-center opacity-30" 
          />
        )}
        {isSchedule && (
          <CardBackground 
            image={CustomLeague}
            className="absolute inset-0 bg-center opacity-30" 
          />
        )}
        {(isDaily || isMonthly || isPlayerMap || isFighting) && (
          <CardPattern
            pattern={RewardsPattern2}
            className="opacity-40"
          />
        )}
        {isTvTools && (
          <CardPattern
            pattern={RewardsPattern1}
            className="opacity-40"
          />
        )}
        {pattern && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <img
              src={pattern}
              alt=""
              className="w-24 h-24 object-contain"
            />
          </div>
        )}
        <CardContent>
          <div className="flex flex-col justify-end h-full">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

DashboardCard.displayName = "DashboardCard";

// Composant pour les cartes principales
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

// Composant pour les cartes de planning
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