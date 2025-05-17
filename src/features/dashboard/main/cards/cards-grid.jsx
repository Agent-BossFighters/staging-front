import { XPProgress } from "@/features/dashboard/main/xp/xp-progress";
import LockerCard from "./locker-card";
import TvToolsCard from "./tv-tools-card";
import DataLabCard from "./datalab-card";
import ScheduleCard from "./schedule-card";
import FightingCard from "./fighting-card";
import DailyCard from "./daily-card";
import MonthlyCard from "./monthly-card";
import PlayerMapCard from "./player-map-card";
import { useAuth } from "@context/auth.context";
import useUmamiTracking from "@utils/hooks/useUmamiTracking";

const disabledCards = {
  locker: false,
  datalab: false,
  daily: false,
  schedule: true,
  monthly: false,
  tvtools: true,
  fighting: false,
  playermap: false,
  xp: false,
};

const premiumCards = {
  locker: false,
  datalab: false,
  daily: false,
  schedule: false,
  monthly: true,
  tvtools: true,
  fighting: false, // TODO: Add admin only, remove after testing revert to true
  playermap: false, // TODO: Add admin only, remove after testing revert to true
  xp: true,
};

// TODO: Add admin only, remove after testing (4 lignes)
const adminOnlyCards = {
  fighting: true,
  // playermap: true, TODO: free access during Base Hackathon
};

const disabledStyle =
  "opacity-50 pointer-events-none cursor-not-allowed bg-[#1A1B1E]/80 rounded-2xl";

export function CardsGrid() {
  const { user } = useAuth();
  const isPremium = user?.isPremium === true;
  const { track } = useUmamiTracking();

  const handleCardClick = (cardName, path) => {
    track(`${cardName}_card_click`, path, { section: cardName }); // Suivre le clic
  };

  // TODO: Add admin only, remove after testing (1 ligne)
  const isAdmin = user?.is_admin === true;

  const isCardDisabled = (cardKey) => {
    // TODO: Add admin only, remove after testing (1 ligne)
    if (adminOnlyCards[cardKey] && !isAdmin) return true;

    if (premiumCards[cardKey] && !isPremium) return true;
    return disabledCards[cardKey];
  };

  return (
    <div className="hidden h-full py-10 lg:block p-4 my-auto">
      <div className="h-full mx-auto">
        <div className="grid h-full grid-cols-3 grid-rows-8 gap-[20px]">
          <div
            className={`row-span-6 ${isCardDisabled("locker") ? disabledStyle : ""}`}
          >
            <LockerCard
              onClick={() => handleCardClick("locker", "/dashboard/locker")}
            />
          </div>
          <div
            className={`row-span-4 ${isCardDisabled("datalab") ? disabledStyle : ""}`}
          >
            <DataLabCard
              onClick={() => handleCardClick("datalab", "/dashboard/datalab")}
            />
          </div>
          <div
            className={`row-span-3 col-start-3 row-start-2 ${isCardDisabled("daily") ? disabledStyle : ""}`}
          >
            <DailyCard
              onClick={() =>
                handleCardClick("daily", "/dashboard/schedule/daily")
              }
            />
          </div>
          <div
            className={`row-span-2 col-start-2 row-start-5 ${isCardDisabled("fighting") ? disabledStyle : ""}`}
          >
            <FightingCard
              onClick={() => handleCardClick("fighting", "/dashboard/fighting")}
            />
          </div>
          <div
            className={`row-span-2 col-start-2 row-start-7 ${isCardDisabled("playermap") ? disabledStyle : ""}`}
          >
            <PlayerMapCard
              onClick={() =>
                handleCardClick("playermap", "/dashboard/playermap")
              }
            />
          </div>
          <div
            className={`row-span-2 col-start-3 row-start-5 ${isCardDisabled("monthly") ? disabledStyle : ""}`}
          >
            <MonthlyCard
              onClick={() =>
                handleCardClick("monthly", "/dashboard/schedule/monthly")
              }
            />
          </div>
          <div
            className={`row-span-2 col-start-1 row-start-7 ${isCardDisabled("tvtools") ? disabledStyle : ""}`}
          >
            <TvToolsCard
              onClick={() => handleCardClick("tvtools", "/dashboard/tv-tools")}
            />
          </div>
          <div
            className={`row-span-2 col-start-3 row-start-7 ${isCardDisabled("schedule") ? disabledStyle : ""}`}
          >
            <ScheduleCard
              onClick={() => handleCardClick("schedule", "/dashboard/schedule")}
            />
          </div>
          <div
            className={`col-start-3 row-start-1 ${isCardDisabled("xp") ? disabledStyle : ""}`}
          >
            <XPProgress
              onClick={() => handleCardClick("xp", "/dashboard/xp")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
