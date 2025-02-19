import { useEffect } from "react";
import DailySummary from "./daily-summary";
import DailyMatches from "./daily-matches";
import { useDaily } from "./hook/useDaily";

export default function DailyContainer() {
  const {
    matches,
    builds,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    fetchDailyMetrics,
    fetchMyBuilds,
    addMatch,
    updateMatch,
    deleteMatch,
    dailySummary
  } = useDaily();

  useEffect(() => {
    fetchDailyMetrics(selectedDate);
    fetchMyBuilds();
  }, [selectedDate]);

  if (error) {
    return (
      <div className="flex flex-col px-5">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-5 gap-5">
      <h1 className="text-6xl font-extrabold py-4 text-primary">DAILY</h1>
      
      <DailySummary 
        date={selectedDate}
        summary={dailySummary}
      />

      <DailyMatches 
        matches={matches}
        builds={builds}
        loading={loading}
        onAdd={addMatch}
        onUpdate={updateMatch}
        onDelete={deleteMatch}
      />
    </div>
  );
} 