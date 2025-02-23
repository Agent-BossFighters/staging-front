import { useState, useEffect } from "react";
import { putData } from "@utils/api/data";
import { rarities } from "@shared/data/rarities.json";
import { LUCK_RATES } from "@constants/gameConstants";
import { useMatchCalculations } from "./useMatchCalculations";

export const useEditMatch = (setMatches, builds) => {
  const { calculateLuckrate, calculateEnergyUsed } = useMatchCalculations();
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editedBuildId, setEditedBuildId] = useState("");
  const [editedSlots, setEditedSlots] = useState("");
  const [editedMap, setEditedMap] = useState("");
  const [editedTime, setEditedTime] = useState("");
  const [editedResult, setEditedResult] = useState("");
  const [editedBft, setEditedBft] = useState("");
  const [editedFlex, setEditedFlex] = useState("");
  const [editedBadges, setEditedBadges] = useState(
    Array(5).fill({ rarity: "rare" })
  );
  const [selectedBuild, setSelectedBuild] = useState(null);

  // Met à jour le build sélectionné quand l'ID change
  useEffect(() => {
    if (editedBuildId && builds) {
      const build = builds.find((b) => b.id === editedBuildId);
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
    const initialBadges = Array(5)
      .fill(null)
      .map((_, index) => {
        if (match.badges && match.badges[index]) {
          return match.badges[index];
        }
        return { rarity: "rare" };
      });
    setEditedBadges(initialBadges);

    // Set selected build
    const build = builds.find((b) => b.id === match.build.id);
    setSelectedBuild(build || null);
  };

  const handleSave = async () => {
    if (!selectedBuild) {
      console.error("No build selected");
      return;
    }

    const updatedMatch = {
      date: new Date().toISOString(),
      build: {
        id: selectedBuild.id,
        buildName: selectedBuild.buildName,
        bonusMultiplier: selectedBuild.bonusMultiplier || 1.0,
        perksMultiplier: selectedBuild.perksMultiplier || 1.0,
      },
      map: editedMap,
      totalFee: 0,
      feeCost: 0,
      slots: editedSlots,
      luckrate: calculateLuckrate(editedBadges),
      time: editedTime,
      energyUsed: calculateEnergyUsed(editedTime),
      energyCost: 1.49,
      totalToken: editedBft,
      tokenValue: 0.01,
      totalPremiumCurrency: editedFlex,
      premiumCurrencyValue: 0.00744,
      result: editedResult,
      badges: editedBadges.map((badge, index) => ({
        nftId: badge.nftId || null,
        rarity: badge.rarity,
        slot: index + 1,
      })),
      calculated: {
        luckrate: calculateLuckrate(editedBadges),
        energyCost: (calculateEnergyUsed(editedTime) * 1.49).toFixed(2),
        tokenValue: (editedBft * 0.01).toFixed(2),
        premiumValue: (editedFlex * 0.00744).toFixed(2),
        feeCost: 0,
        profit: (
          editedBft * 0.01 +
          editedFlex * 0.00744 -
          calculateEnergyUsed(editedTime) * 1.49
        ).toFixed(2),
      },
    };

    try {
      const response = await putData(`v1/matches/${editingMatchId}`, {
        match: updatedMatch,
      });
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
    handleCancel,
  };
};
