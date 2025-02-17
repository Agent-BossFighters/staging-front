import { useState, useEffect } from "react";
import { getData } from "@utils/api/data";

export const useLevelCalculator = () => {
  const [levels] = useState(Array.from({ length: 30 }, (_, i) => i + 1));
  const [levelData, setLevelData] = useState({
    spMarksNb: [],
    spMarksCost: [],
    totalCost: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLevelUpData = async () => {
    try {
      setLoading(true);
      const response = await getData("/v1/data_lab/contracts");
      if (response && response.level_up) {
        setLevelData({
          spMarksNb: response.level_up.sp_marks_nb,
          spMarksCost: response.level_up.sp_marks_cost,
          totalCost: response.level_up.total_cost
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevelUpData();
  }, []);

  return { levels, levelData, loading, error };
};