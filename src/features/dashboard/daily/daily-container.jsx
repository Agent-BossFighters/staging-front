import { useEffect } from "react";
import DailySummary from "./daily-summary";
import DailyMatches from "./daily-matches";
import { useDailyData } from "./hooks/useDailyData.jsx";

export default function DailyContainer() {
  const {
    summary,
    matches,
    builds,
    loading,
    error,
    selectedDate,
    fetchDailyData,
    addMatch,
    updateMatch,
    deleteMatch,
  } = useDailyData();

  useEffect(() => {
    fetchDailyData(selectedDate);
  }, [selectedDate, fetchDailyData]);

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
    <div className="flex flex-col w-[110%] -ml-[5%]">
      <DailySummary date={selectedDate} summary={summary} />

      {builds.length === 0 ? (
        <div className="text-yellow-400 text-xl text-center py-4">
          Aucun build disponible. Veuillez d'abord créer des builds dans la
          section Locker.
        </div>
      ) : (
        <DailyMatches
          matches={matches}
          builds={builds}
          loading={loading}
          onAdd={addMatch}
          onUpdate={updateMatch}
          onDelete={deleteMatch}
        />
      )}
    </div>
  );
}
