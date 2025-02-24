import { useEffect } from "react";
import DailySummary from "./daily-summary";
import DailyMatches from "./daily-matches";
import { useDaily } from "./hooks/useDaily";

export default function DailyContainer() {
  const {
    matches,
    builds = [],
    loading,
    selectedDate,
    dailySummary,
    addMatch,
    updateMatch,
    deleteMatch,
    initializeData,
  } = useDaily();

  useEffect(() => {
    initializeData();
  }, [selectedDate]);

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
    <div className="flex flex-col px-5 gap-5">
      <h1 className="text-6xl font-extrabold py-4 text-primary">DAILY</h1>

      <DailySummary date={selectedDate} summary={dailySummary} />

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
