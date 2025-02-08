import { useState } from "react";
import { getData } from "@utils/api/data";

export const useBadges = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBadges = async () => {
    setLoading(true);
    const payload = await getData("/v1/badges/owned");
    if (payload && payload.badges) {
      setBadges(payload.badges);
    } else {
      setBadges([]);
    }
    setLoading(false);
  };
  return { badges, setBadges, loading, setLoading, fetchMyBadges };
};
