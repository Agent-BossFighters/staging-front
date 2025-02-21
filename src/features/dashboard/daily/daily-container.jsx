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
    setSelectedDate,
    fetchDailyMetrics,
    fetchMyBuilds,
    addMatch,
    updateMatch,
    deleteMatch,
    dailySummary
  } = useDaily();

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchMyBuilds();
        await fetchDailyMetrics(selectedDate);
      } catch (error) {
        // Les erreurs sont déjà gérées par data.js
      }
    };
    loadData();
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <div className="text-xl">Chargement des données...</div>
      </div>
    );
  }

  const handleDelete = async (id) => {
    try {
      await deleteMatch(id);
      await fetchDailyMetrics(selectedDate);
    } catch (error) {
      // Les erreurs sont déjà gérées par data.js
    }
  };

  const handleAddMatch = async (matchData) => {
    try {
      await addMatch(matchData);
      await fetchDailyMetrics(selectedDate);
    } catch (error) {
      // Les erreurs sont déjà gérées par data.js
    }
  };

  return (
    <div className="flex flex-col px-5 gap-5">
      <h1 className="text-6xl font-extrabold py-4 text-primary">DAILY</h1>
      
      <DailySummary 
        date={selectedDate}
        summary={dailySummary}
      />

      {builds.length === 0 ? (
        <div className="text-yellow-400 text-xl text-center py-4">
          Aucun build disponible. Veuillez d'abord créer des builds dans la section Locker.
        </div>
      ) : (
        <DailyMatches 
          matches={matches}
          builds={builds}
          loading={loading}
          onAdd={handleAddMatch}
          onUpdate={updateMatch}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
} 