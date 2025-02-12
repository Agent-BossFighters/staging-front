import { useState } from "react";
import { getData } from "@utils/api/data";

export const useContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyContracts = async () => {
    setLoading(true);
    const payload = await getData("/v1/data_lab/contracts");
    if (payload) {
      setContracts(payload);
    } else {
      setContracts([]);
    }
    setLoading(false);
  };
  return { contracts, setContracts, loading, setLoading, fetchMyContracts };
};
