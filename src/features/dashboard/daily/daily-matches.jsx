import { useState } from "react";
import MatchesList from "./components/matches-list";

export default function DailyMatches({
  matches,
  builds,
  loading,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editedData, setEditedData] = useState(null);

  const handleEdit = (match) => {
    setEditingMatchId(match.id);
    setEditedData({
      buildId: builds.find((b) => b.buildName === match.build)?.id || "",
      map: match.map || "",
      time: match.time || "",
      result: match.result || "",
      bft: match.totalToken || "",
      flex: match.totalPremiumCurrency || "",
      rarities: Array(5)
        .fill("none")
        .map((_, index) => {
          const badge = match.badge_used?.find((b) => b.slot === index + 1);
          return badge ? badge.rarity : "none";
        }),
    });
  };

  const handleCancel = () => {
    setEditingMatchId(null);
    setEditedData(null);
  };

  const handleEditField = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

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
    <div className="flex flex-col px-5">
      <h2 className="text-3xl font-extrabold py-2">MATCHES</h2>
      <MatchesList
        matches={matches}
        builds={builds}
        unlockedSlots={5}
        editingMatchId={editingMatchId}
        editedData={editedData}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onEdit={handleEdit}
        onEditField={handleEditField}
        onCancel={handleCancel}
      />
    </div>
  );
}
