import { useState } from "react";
import { getData } from "@utils/api/data";

export const useBuilds = () => {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBuilds = async () => {
    try {
      setLoading(true);
      const payload = await getData("v1/user_builds");
      if (payload?.builds) {
        setBuilds(payload.builds);
      } else {
        setBuilds([]);
      }
    } catch (error) {
      console.error("Error fetching builds:", error);
      setBuilds([]);
    } finally {
      setLoading(false);
    }
  };

  return { builds, setBuilds, loading, setLoading, fetchMyBuilds };
};
