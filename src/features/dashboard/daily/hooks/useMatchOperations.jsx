import { useState, useCallback } from "react";
import { getData, postData, putData, deleteData } from "@utils/api/data";

export const useMatchOperations = () => {
  const [state, setState] = useState({
    matches: [],
    loading: false,
    selectedDate: new Date(),
  });

  const fetchMatches = useCallback(async (date) => {
    if (state.loading) return;

    const dateString = date.toISOString().split("T")[0];
    const currentDateString = state.selectedDate.toISOString().split("T")[0];
    if (dateString === currentDateString && state.matches.length > 0) {
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));
    const formattedDate = date.toISOString().split("T")[0];
    const response = await getData(`v1/matches/daily/${formattedDate}`);
    console.log("Response from backend:", response); // Debug log
    if (response?.matches) {
      setState((prev) => ({
        ...prev,
        matches: response.matches,
        loading: false,
        selectedDate: new Date(date),
      }));
    } else {
      setState((prev) => ({
        ...prev,
        matches: [],
        loading: false,
      }));
    }
  }, []);

  const addMatch = useCallback(async (matchData) => {
    const response = await postData("v1/matches", matchData);
    console.log("Add match response:", response); // Debug log
    if (response?.match) {
      setState((prev) => ({
        ...prev,
        matches: [...prev.matches, response.match],
      }));
      return response.match;
    }
    return null;
  }, []);

  const updateMatch = useCallback(async (matchId, matchData) => {
    const response = await putData(`v1/matches/${matchId}`, matchData);
    console.log("Update match response:", response); // Debug log
    if (response?.match) {
      setState((prev) => ({
        ...prev,
        matches: prev.matches.map((match) =>
          match.id === matchId ? response.match : match
        ),
      }));
      return response.match;
    }
    return null;
  }, []);

  const deleteMatch = useCallback(async (matchId) => {
    const response = await deleteData(`v1/matches/${matchId}`);
    if (response) {
      setState((prev) => ({
        ...prev,
        matches: prev.matches.filter((match) => match.id !== matchId),
      }));
      return true;
    }
    return false;
  }, []);

  return {
    ...state,
    addMatch,
    updateMatch,
    deleteMatch,
    fetchMatches,
  };
};
