import { useUserPreference } from "@context/userPreference.context";
import { useState, useEffect, useCallback, useMemo } from "react";
import { getData } from "@utils/api/data";
import data from "@shared/data/rarities.json";

export const useRarityManagement = () => {
  const { unlockedSlots } = useUserPreference();
  const [badges, setBadges] = useState([]);
  const rarities = useMemo(() => data.rarities, []);

  const rarityPrices = useMemo(() => {
    return rarities.reduce((acc, r) => {
      if (r.price) acc[r.rarity.toLowerCase()] = r.price;
      return acc;
    }, {});
  }, [rarities]);

  const processBadges = useCallback((rawBadges) => {
    return rawBadges
      .filter((badge) => badge && typeof badge === "object")
      .map((badge) => ({
        ...badge,
        id: badge.id || badge._id,
        rarity:
          typeof badge.rarity === "object"
            ? badge.rarity.name
            : badge.rarity || badge.type || "unknown",
      }));
  }, []);

  const fetchBadges = useCallback(async () => {
    try {
      const response = await getData("v1/badges");
      if (response?.badges) {
        const processedBadges = processBadges(response.badges);
        setBadges(processedBadges);
      } else {
        setBadges([]);
      }
    } catch (error) {
      console.error("Error fetching badges:", error);
      setBadges([]);
    }
  }, [processBadges]);

  useEffect(() => {
    fetchBadges();
  }, []);

  const getRarityColor = useCallback(
    (rarity) => {
      if (!rarity || rarity === "none") return "";
      const rarityInfo = rarities.find(
        (r) => r.rarity.toLowerCase() === String(rarity).toLowerCase()
      );
      return rarityInfo ? rarityInfo.color : "";
    },
    [rarities]
  );

  const getRarityDisplay = useCallback(
    (rarity) => {
      if (!rarity || rarity === "none") return "-";
      const normalizedRarity =
        String(rarity).charAt(0).toUpperCase() +
        String(rarity).slice(1).toLowerCase();
      const rarityInfo = rarities.find((r) => r.rarity === normalizedRarity);
      return rarityInfo ? rarityInfo.rarity.charAt(0) : "-";
    },
    [rarities]
  );

  const formatRarityName = useCallback((rarity) => {
    return String(rarity).toLowerCase();
  }, []);

  const sortRarities = useCallback(
    (rarityList) => {
      return rarityList.sort((a, b) => {
        const orderA = rarities.find((r) => r.rarity === a)?.order || 0;
        const orderB = rarities.find((r) => r.rarity === b)?.order || 0;
        return orderA - orderB;
      });
    },
    [rarities]
  );

  return {
    unlockedSlots,
    rarities,
    badges,
    rarityPrices,
    getRarityColor,
    getRarityDisplay,
    formatRarityName,
    sortRarities,
  };
};
