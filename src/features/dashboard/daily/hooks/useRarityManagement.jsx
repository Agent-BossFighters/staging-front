import { useUserPreference } from "@context/userPreference.context";
import { useState, useEffect } from "react";
import { getData } from "@utils/api/data";
import data from "@shared/data/rarities.json";

export const useRarityManagement = () => {
  const { unlockedSlots } = useUserPreference();
  const [badges, setBadges] = useState([]);
  const rarities = data.rarities;

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await getData("v1/badges");
        console.log("Raw badges response:", response);

        if (response?.badges) {
          // Assurez-vous que chaque badge a une rareté valide
          const processedBadges = response.badges
            .filter((badge) => badge && typeof badge === "object")
            .map((badge) => ({
              ...badge,
              id: badge.id || badge._id,
              rarity: String(badge.rarity || badge.type || "unknown"),
            }));

          console.log("Processed badges:", processedBadges);
          setBadges(processedBadges);
        } else {
          console.warn("No badges found in response");
          setBadges([]);
        }
      } catch (error) {
        console.error("Error fetching badges:", error);
        setBadges([]);
      }
    };

    fetchBadges();
  }, []);

  const getRarityColor = (rarity) => {
    if (!rarity || rarity === "none") return "";
    const rarityInfo = rarities.find(
      (r) => r.rarity.toLowerCase() === String(rarity).toLowerCase()
    );
    return rarityInfo ? rarityInfo.color : "";
  };

  const getRarityDisplay = (rarity) => {
    if (!rarity || rarity === "none") return "-";
    const normalizedRarity =
      String(rarity).charAt(0).toUpperCase() +
      String(rarity).slice(1).toLowerCase();
    const rarityInfo = rarities.find((r) => r.rarity === normalizedRarity);
    return rarityInfo ? rarityInfo.rarity.charAt(0) : "-";
  };

  const formatRarityName = (rarity) => {
    return String(rarity).toLowerCase();
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
    badges,
    getRarityColor,
    getRarityDisplay,
    formatRarityName,
    sortRarities,
  };
};
