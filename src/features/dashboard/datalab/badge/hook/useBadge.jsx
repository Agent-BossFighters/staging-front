import { useState } from "react";
import { getData } from "@utils/api/data";

export const useBadges = () => {
  const [badges, setBadges] = useState([]);
  const [mainBadges, setMainBadges] = useState([]);
  const [priceBadges, setPriceBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainSlotsUsed, setMainSlotsUsed] = useState("1");
  const [priceSlotsUsed, setPriceSlotsUsed] = useState("1");
  const [bftMultiplier, setBftMultiplier] = useState("1.0");

  const fetchBadges = async () => {
    setLoading(true);
    try {
      // Fetch data for main table (without multiplier)
      const mainPayload = await getData(`/v1/data_lab/badges?slots_used=${mainSlotsUsed}`);
      if (mainPayload) {
        setMainBadges(mainPayload);
        setBadges(mainPayload);
      }

      // Fetch data for price table (with multiplier)
      const pricePayload = await getData(`/v1/data_lab/badges?slots_used=${priceSlotsUsed}&bft_multiplier=${bftMultiplier}`);
      if (pricePayload) {
        setPriceBadges(pricePayload);
      }
    } catch (error) {
      console.error("Error fetching badges:", error);
      setMainBadges([]);
      setPriceBadges([]);
      setBadges([]);
    } finally {
      setLoading(false);
    }
  };

  const updateMainTableMetrics = async (newSlotsUsed) => {
    try {
      const payload = await getData(`/v1/data_lab/badges?slots_used=${newSlotsUsed}`);
      if (payload) {
        setMainBadges(payload);
        setBadges(payload);
        setMainSlotsUsed(newSlotsUsed);
      }
    } catch (error) {
      console.error("Error updating main table metrics:", error);
    }
  };

  const updatePriceTableMetrics = async (newSlotsUsed, newBftMultiplier) => {
    try {
      const payload = await getData(`/v1/data_lab/badges?slots_used=${newSlotsUsed}&bft_multiplier=${newBftMultiplier}`);
      if (payload) {
        setPriceBadges(payload);
        setPriceSlotsUsed(newSlotsUsed);
        setBftMultiplier(newBftMultiplier);
      }
    } catch (error) {
      console.error("Error updating price table metrics:", error);
    }
  };

  return { 
    badges,
    setBadges,
    mainBadges,
    priceBadges,
    loading, 
    setLoading, 
    fetchBadges,
    mainSlotsUsed,
    priceSlotsUsed,
    bftMultiplier,
    updateMainTableMetrics,
    updatePriceTableMetrics
  };
};
