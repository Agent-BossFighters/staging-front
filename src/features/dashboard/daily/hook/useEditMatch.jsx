import { useState } from "react";
import { putData } from "@utils/api/data";

export const useEditMatch = (setMatches) => {
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editedBuildId, setEditedBuildId] = useState("");
  const [editedSlots, setEditedSlots] = useState("");
  const [editedMap, setEditedMap] = useState("");
  const [editedFees, setEditedFees] = useState("");
  const [editedEnergy, setEditedEnergy] = useState("");
  const [editedResult, setEditedResult] = useState("");
  const [editedBft, setEditedBft] = useState("");
  const [editedFlex, setEditedFlex] = useState("");
  const [editedBftMultiplier, setEditedBftMultiplier] = useState("");
  const [editedPerksMultiplier, setEditedPerksMultiplier] = useState("");

  const handleEdit = (match) => {
    setEditingMatchId(match.id);
    setEditedBuildId(match.build.id);
    setEditedSlots(match.build.slots);
    setEditedMap(match.build.map);
    setEditedFees(match.fees.amount);
    setEditedEnergy(match.energy.used);
    setEditedResult(match.result);
    setEditedBft(match.rewards.bft.amount);
    setEditedFlex(match.rewards.flex.amount);
    setEditedBftMultiplier(match.multipliers.bonus);
    setEditedPerksMultiplier(match.multipliers.perks);
  };

  const handleSave = async () => {
    const updatedMatch = {
      build_id: editedBuildId,
      slots: editedSlots,
      map: editedMap,
      fees: editedFees,
      energy: editedEnergy,
      result: editedResult,
      bft: editedBft,
      flex: editedFlex,
      bft_multiplier: editedBftMultiplier,
      perks_multiplier: editedPerksMultiplier
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
    setEditedFees("");
    setEditedEnergy("");
    setEditedResult("");
    setEditedBft("");
    setEditedFlex("");
    setEditedBftMultiplier("");
    setEditedPerksMultiplier("");
  };

  return {
    editingMatchId,
    editedBuildId,
    editedSlots,
    editedMap,
    editedFees,
    editedEnergy,
    editedResult,
    editedBft,
    editedFlex,
    editedBftMultiplier,
    editedPerksMultiplier,
    setEditedBuildId,
    setEditedSlots,
    setEditedMap,
    setEditedFees,
    setEditedEnergy,
    setEditedResult,
    setEditedBft,
    setEditedFlex,
    setEditedBftMultiplier,
    setEditedPerksMultiplier,
    handleEdit,
    handleSave,
    handleCancel
  };
}; 