import { useState, useEffect } from "react";
import { putData } from "@utils/api/data";

export const useEditMatch = (setMatches, builds) => {
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editedBuildId, setEditedBuildId] = useState("");
  const [editedSlots, setEditedSlots] = useState("");
  const [editedMap, setEditedMap] = useState("");
  const [editedEnergy, setEditedEnergy] = useState("");
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
    setEditedSlots(match.slots.count);
    setEditedMap(match.build.map);
    setEditedEnergy(match.energy.used);
    setEditedResult(match.result);
    setEditedBft(match.rewards.bft.amount);
    setEditedFlex(match.rewards.flex.amount);
    
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
      slots: editedSlots,
      map: editedMap,
      energyUsed: editedEnergy,
      energyCost: 0.1,
      result: editedResult,
      totalToken: editedBft,
      tokenValue: 0.2,
      totalPremiumCurrency: editedFlex,
      premiumCurrencyValue: 0.1,
      badges: editedBadges
    };

    try {
      const response = await putData(`/v1/matches/${editingMatchId}`, { match: updatedMatch });
      if (response?.daily_metrics) {
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
    setEditedEnergy("");
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
    editedEnergy,
    editedResult,
    editedBft,
    editedFlex,
    editedBadges,
    selectedBuild,
    setEditedBuildId,
    setEditedSlots,
    setEditedMap,
    setEditedEnergy,
    setEditedResult,
    setEditedBft,
    setEditedFlex,
    setEditedBadges,
    handleEdit,
    handleSave,
    handleCancel
  };
}; 