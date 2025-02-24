import { useState } from "react";
import MatchesTable from "./components/matches-table";
import { useUserPreference } from "@context/userPreference.context";

const initialEditState = {
  buildId: "",
  map: "",
  time: "",
  result: "",
  bft: "",
  flex: "",
  rarities: [],
};

export default function DailyMatches({
  matches,
  builds,
  loading,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const { unlockedSlots } = useUserPreference();
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editedData, setEditedData] = useState({
    ...initialEditState,
    rarities: Array(unlockedSlots).fill("rare"),
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
      rarities: match.selectedRarities || Array(unlockedSlots).fill("rare"),
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
      ...initialEditState,
      rarities: Array(unlockedSlots).fill("rare"),
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
      unlockedSlots={unlockedSlots}
    />
  );
}
