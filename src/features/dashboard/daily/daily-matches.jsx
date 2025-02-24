import { useState, useEffect } from "react";
import MatchesList from "@features/dashboard/daily/components/matches-list";
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

export default function DailyMatches() {
  const {
    matches,
    builds,
    loading,
    unlockedSlots,
    handleAddMatch,
    handleUpdateMatch,
    handleDeleteMatch,
    initializeData
  } = useUserPreference();

  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editedData, setEditedData] = useState({
    ...initialEditState,
    rarities: Array(unlockedSlots).fill("none"),
  });

  useEffect(() => {
    initializeData();
  }, []);

  const handleEdit = (match) => {
    const initialRarities = Array(unlockedSlots).fill("none");
    
    if (match.badge_used) {
      match.badge_used.forEach(badge => {
        if (badge.slot <= unlockedSlots) {
          initialRarities[badge.slot - 1] = badge.rarity;
        }
      });
    }

    setEditingMatchId(match.id);
    setEditedData({
      buildId: builds.find((b) => b.buildName === match.build)?.id || "",
      map: match.map,
      time: match.time,
      result: match.result,
      bft: match.totalToken,
      flex: match.totalPremiumCurrency,
      rarities: initialRarities,
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
      rarities: Array(unlockedSlots).fill("none"),
    });
  };

  return (
    <MatchesList
      matches={matches}
      builds={builds}
      loading={loading}
      editingMatchId={editingMatchId}
      editedData={editedData}
      onAdd={handleAddMatch}
      onUpdate={handleUpdateMatch}
      onDelete={handleDeleteMatch}
      onEdit={handleEdit}
      onEditField={handleEditField}
      onCancel={handleCancel}
      unlockedSlots={unlockedSlots}
    />
  );
}
