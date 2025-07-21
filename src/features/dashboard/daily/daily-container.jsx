import { useEffect } from "react";
import DailySummary from "./daily-summary";
import DailyMatches from "./daily-matches";
import { useDailyData } from "./hooks/useDailyData.jsx";
import DateSelector from "./components/DateSelector";
import Calculator from "./components/Calculator";

export default function DailyContainer() {
  const badges = [
  { id: 'b1', name: 'Badge Alpha', rarity: 'Common' },
  { id: 'b2', name: 'Badge Beta', rarity: 'Rare' },
  { id: 'b3', name: 'Badge Gamma', rarity: 'Legendary' }
]
  const {
    summary,
    matches,
    builds,
    loading,
    error,
    selectedDate,
    createDateHandlers,
    addMatch,
    updateMatch,
    deleteMatch,
  } = useDailyData();

  // Obtenir les gestionnaires de date
  const { handlePreviousDay, handleNextDay, handleToday } = createDateHandlers(7);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-4 w-48 bg-muted-foreground/30 rounded"></div>
          <div className="h-4 w-36 bg-muted-foreground/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-[100%]">
      <div className="flex items-center justify-end mb-4">
        <DateSelector
          selectedDate={selectedDate}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          onToday={handleToday}
          maxDaysBack={7}
        />
      </div>

      <DailySummary date={selectedDate} summary={summary} />

      {builds.length === 0 ? (
        <div className="text-yellow-400 text-xl text-center py-4">
          No builds available. Please create a build in the Locker section first.
        </div>
      ) : (
        <>
          <Calculator userBadges={badges} />
          <DailyMatches
            matches={matches}
            builds={builds}
            loading={loading}
            onAdd={addMatch}
            onUpdate={updateMatch}
            onDelete={deleteMatch}
            selectedDate={selectedDate}
          />
        </>
      )}
    </div>
  );
}
