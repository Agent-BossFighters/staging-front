import { useState } from "react";
import { getData } from "@utils/api/data";

export const useContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [levelData, setLevelData] = useState({
    spMarksNb: [],
    spMarksCost: [],
    totalCost: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyContracts = async () => {
    setLoading(true);
    try {
      const payload = await getData("v1/data_lab/contracts");
      if (payload) {
        // Set contracts data
        setContracts(payload);

        // Set level up data if available
        if (payload.level_up) {
          setLevelData({
            spMarksNb: payload.level_up.sp_marks_nb || [],
            spMarksCost: payload.level_up.sp_marks_cost || [],
            totalCost: payload.level_up.total_cost || [],
          });
        }
      } else {
        setContracts([]);
        setLevelData({
          spMarksNb: [],
          spMarksCost: [],
          totalCost: [],
        });
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    contracts,
    levelData,
    loading,
    error,
    fetchMyContracts,
  };
};
