import { useState } from "react";
import { getData } from "@utils/api/data";

export const useBuilds = () => {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBuilds = async () => {
    setLoading(true);
    const payload = await getData("v1/user_builds");
    if (payload && payload.builds) {
      setBuilds(payload.builds);
    } else {
      setBuilds([]);
    }
    setLoading(false);
  };
  return { builds, setBuilds, loading, setLoading, fetchMyBuilds };
};
