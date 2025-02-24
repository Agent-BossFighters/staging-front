import { useUserPreference } from "@context/userPreference.context";
import data from "@shared/data/rarities.json";

export const useRarityManagement = () => {
  const { unlockedSlots } = useUserPreference();
  const rarities = data.rarities;

  const getRarityColor = (rarity) => {
    if (!rarity || rarity === "none") return "";
    const rarityInfo = rarities.find(
      (r) => r.rarity.toLowerCase() === rarity.toLowerCase()
    );
    return rarityInfo ? rarityInfo.color : "";
  };

  const getRarityDisplay = (rarity) => {
    if (!rarity || rarity === "none") return "-";
    const normalizedRarity =
      rarity.charAt(0).toUpperCase() + rarity.slice(1).toLowerCase();
    const rarityInfo = rarities.find((r) => r.rarity === normalizedRarity);
    return rarityInfo ? rarityInfo.rarity.charAt(0) : "-";
  };

  const formatRarityName = (rarity) => {
    return rarity.toLowerCase();
  };

  const sortRarities = (rarityList) => {
    return rarityList.sort((a, b) => {
      const orderA = rarities.find((r) => r.rarity === a)?.order || 0;
      const orderB = rarities.find((r) => r.rarity === b)?.order || 0;
      return orderA - orderB;
    });
  };

  return {
    unlockedSlots,
    rarities,
    getRarityColor,
    getRarityDisplay,
    formatRarityName,
    sortRarities,
  };
};
