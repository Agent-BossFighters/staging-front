import { useState } from "react";
import { getData } from "@utils/api/data";

export const useContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [levelData, setLevelData] = useState({
    sp_marks_nb: [],
    sp_marks_cost: [],
    total_sp_marks: [],
    total_cost: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyContracts = async () => {
    setLoading(true);
    try {
      const payload = await getData("v1/data_lab/contracts");
      if (payload) {
        // Set contracts data
        setContracts(payload.contracts || []);

        // Set level up data if available
        if (payload.level_up) {
          setLevelData({
            sp_marks_nb: payload.level_up.sp_marks_nb || [],
            sp_marks_cost: payload.level_up.sp_marks_cost || [],
            total_sp_marks: payload.level_up.total_sp_marks || [],
            total_cost: payload.level_up.total_cost || [],
          });
        }
      } else {
        setContracts([]);
        setLevelData({
          sp_marks_nb: [],
          sp_marks_cost: [],
          total_sp_marks: [],
          total_cost: [],
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
