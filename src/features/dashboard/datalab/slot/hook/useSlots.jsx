import { useState } from "react";
import { getData } from "@utils/api/data";

export const useSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSlots = async () => {
    setLoading(true);
    const payload = await getData("/v1/data_lab/slots");
    if (payload) {
      setSlots(payload);
    } else {
      setSlots([]);
    }
    setLoading(false);
  };
  return { slots, setSlots, loading, setLoading, fetchSlots };
};
