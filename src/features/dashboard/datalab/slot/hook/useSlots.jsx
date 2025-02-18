import { useState } from "react";
import { getData } from "@utils/api/data";

export const useSlots = () => {
  const [slots, setSlots] = useState({ slots_cost: [] });
  const [loading, setLoading] = useState(true);

  const fetchSlots = async () => {
    setLoading(true);
    const payload = await getData("/v1/data_lab/slots");
    if (payload) {
      setSlots(payload);
    } else {
      setSlots({ slots_cost: [] });
    }
    setLoading(false);
  };
  return { slots, setSlots, loading, setLoading, fetchSlots };
};
