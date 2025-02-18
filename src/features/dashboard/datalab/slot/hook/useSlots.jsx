import { useState } from "react";
import { getData } from "@utils/api/data";

export const useSlots = () => {
  const [slots, setSlots] = useState({ slots_cost: [], unlocked_slots_by_rarity: {} });
  const [loading, setLoading] = useState(true);
  const [selectedRarity, setSelectedRarity] = useState("Common");

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const payload = await getData("/v1/data_lab/slots");
      if (payload) {
        setSlots(payload);
      } else {
        setSlots({ slots_cost: [], unlocked_slots_by_rarity: {} });
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      setSlots({ slots_cost: [], unlocked_slots_by_rarity: {} });
    }
    setLoading(false);
  };

  const handleRarityChange = (rarity) => {
    setSelectedRarity(rarity);
  };

  // Obtenir les métriques pour la rareté sélectionnée
  const selectedRarityMetrics = slots.unlocked_slots_by_rarity[selectedRarity] || null;

  return { 
    slots, 
    loading, 
    fetchSlots,
    selectedRarity,
    handleRarityChange,
    selectedRarityMetrics
  };
};
