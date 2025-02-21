import { useState } from "react";
import { getData } from "@utils/api/data";

export const useCrafts = () => {
  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCrafts = async () => {
    setLoading(true);
    const payload = await getData("v1/data_lab/craft");
    if (payload) {
      setCrafts(payload);
    } else {
      setCrafts([]);
    }
    setLoading(false);
  };
  return { crafts, setCrafts, loading, setLoading, fetchCrafts };
};
