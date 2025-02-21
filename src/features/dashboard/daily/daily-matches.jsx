import { useState } from "react";
import MatchesTable from "./components/matches-table";
import { useMatchCalculations } from "./hook/useMatchCalculations";

export default function DailyMatches({
  matches,
  builds,
  loading,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editedData, setEditedData] = useState({
    buildId: "",
    map: "",
    time: "",
    result: "",
    bft: "",
    flex: "",
    rarities: Array(5).fill("rare"),
  });

  const handleEdit = (match) => {
    setEditingMatchId(match.id);
    setEditedData({
      buildId: builds.find((b) => b.buildName === match.build)?.id || "",
      map: match.map,
      time: match.time,
      result: match.result,
      bft: match.totalToken,
      flex: match.totalPremiumCurrency,
      rarities: match.selectedRarities || Array(5).fill("rare"),
    });
  };

  const handleEditField = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    setEditingMatchId(null);
    setEditedData({
      buildId: "",
      map: "",
      time: "",
      result: "",
      bft: "",
      flex: "",
      rarities: Array(5).fill("rare"),
    });
  };

  return (
    <MatchesTable
      matches={matches}
      builds={builds}
      loading={loading}
      editingMatchId={editingMatchId}
      editedData={editedData}
      onAdd={onAdd}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onEdit={handleEdit}
      onEditField={handleEditField}
      onCancel={handleCancel}
    />
  );
}
