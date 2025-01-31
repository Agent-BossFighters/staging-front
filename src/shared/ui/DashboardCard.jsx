import * as React from "react";
import { Link } from 'react-router-dom';
import { cn } from "@/utils/lib/utils";

import {
  RewardsPattern1,
  RewardsPattern2,
  Vector,
  Monthly,
  Playermap,
  Locker,
  Schedule,
  CustomLeague,
  Fighting,
  TvTools
} from "@img/index";

const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative block rounded-2xl bg-[#1A1B1E] border border-gray-800/50 transition-all duration-300 overflow-hidden group h-full",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
Card.displayName = "Card";

const CardBackground = React.forwardRef(({ className, image, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute inset-0 bg-cover bg-center bg-no-repeat",
      className
    )}
    style={image ? { backgroundImage: `url(${image})` } : {}}
    {...props}
  />
));
CardBackground.displayName = "CardBackground";

const CardPattern = React.forwardRef(({ className, pattern, ...props }, ref) => (
  <img
    ref={ref}
    src={pattern}
    alt=""
    className={cn(
      "absolute inset-0 w-full h-full object-cover",
      className
    )}
    {...props}
  />
));
CardPattern.displayName = "CardPattern";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex h-full z-10 p-6", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-[#FFD32A] font-bold text-[20px] leading-[24px] tracking-wide mb-1",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-gray-300 text-[10px] leading-[14px] font-normal", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
        {isLocker && backgroundimage && (
          <CardBackground 
            image={backgroundimage} 
            className="w-[90%] h-[90%] m-auto top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-contain"
          />
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

export {
  Card,
  CardBackground,
  CardPattern,
  CardContent,
  CardTitle,
  CardDescription,
  DashboardCard
}; 