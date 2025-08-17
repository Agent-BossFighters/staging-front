import { useState, useCallback } from "react";
import { getData } from "@utils/api/data";

export const useForge = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [perks, setPerks] = useState([]);

  const fetchForge = useCallback(async (type = "merge", item = "digital") => {
    setLoading(true);
    const ts = Date.now();
    const payload = await getData(`v1/data_lab/forge?type=${type}&item=${item}&_ts=${ts}`);
    setRows(Array.isArray(payload) ? payload : []);
    const perksPayload = await getData(`v1/data_lab/perks_lock?_ts=${ts}`);
    setPerks(Array.isArray(perksPayload) ? perksPayload : []);
    setLoading(false);
  }, []);

  return { rows, perks, loading, fetchForge };
};

export default useForge;


