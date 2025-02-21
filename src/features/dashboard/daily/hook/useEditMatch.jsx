import { useState, useEffect } from "react";
import { putData } from "@utils/api/data";

export const useEditMatch = (setMatches, builds) => {
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editedBuildId, setEditedBuildId] = useState("");
  const [editedSlots, setEditedSlots] = useState("");
  const [editedMap, setEditedMap] = useState("");
  const [editedTime, setEditedTime] = useState("");
  const [editedResult, setEditedResult] = useState("");
  const [editedBft, setEditedBft] = useState("");
  const [editedFlex, setEditedFlex] = useState("");
  const [editedBadges, setEditedBadges] = useState(Array(5).fill({ rarity: "rare" }));
  const [selectedBuild, setSelectedBuild] = useState(null);

  // Met à jour le build sélectionné quand l'ID change
  useEffect(() => {
    if (editedBuildId && builds) {
      const build = builds.find(b => b.id === editedBuildId);
      setSelectedBuild(build || null);
    } else {
      setSelectedBuild(null);
    }
  }, [editedBuildId, builds]);

  const handleEdit = (match) => {
    setEditingMatchId(match.id);
    setEditedBuildId(match.build.id);
    setEditedSlots(match.slots);
    setEditedMap(match.map);
    setEditedTime(match.time);
    setEditedResult(match.result);
    setEditedBft(match.totalToken);
    setEditedFlex(match.totalPremiumCurrency);
    
    // Initialize badges with existing data or defaults
    const initialBadges = Array(5).fill(null).map((_, index) => {
      if (match.badges && match.badges[index]) {
        return match.badges[index];
      }
      return { rarity: "rare" };
    });
    setEditedBadges(initialBadges);

    // Set selected build
    const build = builds.find(b => b.id === match.build.id);
    setSelectedBuild(build || null);
  };

  const handleSave = async () => {
    if (!selectedBuild) {
      console.error("No build selected");
      return;
    }

    const updatedMatch = {
      build_id: editedBuildId,
      build: {
        id: editedBuildId,
        buildName: selectedBuild.buildName,
        map: editedMap,
        bonusMultiplier: selectedBuild.bonusMultiplier || 1.0,
        perksMultiplier: selectedBuild.perksMultiplier || 1.0
      },
      slots: editedSlots,
      map: editedMap,
      time: editedTime,
      result: editedResult,
      totalToken: editedBft,
      tokenValue: 0.01,
      totalPremiumCurrency: editedFlex,
      premiumCurrencyValue: 0.00744,
      badges: editedBadges
    };

    try {
      const response = await putData(`/v1/matches/${editingMatchId}`, { match: updatedMatch });
      if (response?.daily_metrics?.matches) {
        setMatches(response.daily_metrics.matches);
        setEditingMatchId(null);
      }
    } catch (error) {
      console.error("Failed to update match:", error);
    }
  };

  const handleCancel = () => {
    setEditingMatchId(null);
    setEditedBuildId("");
    setEditedSlots("");
    setEditedMap("");
    setEditedTime("");
    setEditedResult("");
    setEditedBft("");
    setEditedFlex("");
    setEditedBadges(Array(5).fill({ rarity: "rare" }));
    setSelectedBuild(null);
  };

  return {
    editingMatchId,
    editedBuildId,
    editedSlots,
    editedMap,
    editedTime,
    editedResult,
    editedBft,
    editedFlex,
    editedBadges,
    selectedBuild,
    setEditedBuildId,
    setEditedSlots,
    setEditedMap,
    setEditedTime,
    setEditedResult,
    setEditedBft,
    setEditedFlex,
    setEditedBadges,
    handleEdit,
    handleSave,
    handleCancel
  };
}; 