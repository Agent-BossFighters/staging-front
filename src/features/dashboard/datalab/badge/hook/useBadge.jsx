import { useState } from "react";
import { getData } from "@utils/api/data";

export const useBadges = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBadges = async () => {
    setLoading(true);
    const payload = await getData("/v1/data_lab/badges");
    if (payload) {
      setBadges(payload);
    } else {
      setBadges([]);
    }
    setLoading(false);
  };
  return { badges, setBadges, loading, setLoading, fetchBadges };
};
