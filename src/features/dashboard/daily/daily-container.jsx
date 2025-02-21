import { useEffect } from "react";
import DailySummary from "./daily-summary";
import DailyMatches from "./daily-matches";
import { useDaily } from "./hook/useDaily";

export default function DailyContainer() {
  const {
    matches,
    builds,
    loading,
    selectedDate,
    dailySummary,
    handleAddMatch,
    handleUpdateMatch,
    handleDeleteMatch,
    initializeData,
  } = useDaily();

  useEffect(() => {
    initializeData();
  }, [selectedDate]);

  return (
    <div className="flex flex-col px-5 gap-5">
      <h1 className="text-6xl font-extrabold py-4 text-primary">DAILY</h1>

      <DailySummary date={selectedDate} summary={dailySummary} />

      {builds.length === 0 && !loading ? (
        <div className="text-yellow-400 text-xl text-center py-4">
          Aucun build disponible. Veuillez d'abord créer des builds dans la
          section Locker.
        </div>
      ) : (
        <DailyMatches
          matches={matches}
          builds={builds}
          loading={loading}
          onAdd={handleAddMatch}
          onUpdate={handleUpdateMatch}
          onDelete={handleDeleteMatch}
        />
      )}
    </div>
  );
}
