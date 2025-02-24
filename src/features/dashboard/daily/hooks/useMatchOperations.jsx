import { useState, useCallback } from "react";
import { getData, postData, putData, deleteData } from "@utils/api/data";
import { toast } from "react-hot-toast";

export const useMatchOperations = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleError = async (error) => {
    if (error.response?.status === 422) {
      const data = await error.response.json();
      if (data.errors) {
        toast.error(data.errors.join(", "));
      } else if (data.error) {
        toast.error(data.error);
      } else {
        toast.error("Une erreur de validation est survenue");
      }
      return null;
    }
    toast.error(error.message || "Une erreur est survenue");
    return null;
  };

  const addMatch = useCallback(async (matchData) => {
    setLoading(true);
    try {
      const response = await postData("v1/matches", matchData);
      if (!response) {
        toast.error("Une erreur est survenue lors de l'ajout du match");
        return null;
      }

      setMatches((prev) => [...prev, response.match]);
      toast.success("Match ajouté avec succès");
      return response.match;
    } catch (error) {
      console.error("Erreur lors de l'ajout du match:", error);
      return handleError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMatch = useCallback(async (matchId, matchData) => {
    setLoading(true);
    try {
      const response = await putData(`v1/matches/${matchId}`, matchData);
      if (!response) {
        toast.error("Une erreur est survenue lors de la mise à jour du match");
        return null;
      }

      setMatches((prev) =>
        prev.map((match) => (match.id === matchId ? response.match : match))
      );
      toast.success("Match mis à jour avec succès");
      return response.match;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du match:", error);
      return handleError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMatch = useCallback(async (matchId) => {
    try {
      const response = await deleteData(`v1/matches/${matchId}`);
      if (!response) {
        toast.error("Une erreur est survenue lors de la suppression du match");
        return false;
      }

      setMatches((prev) => prev.filter((match) => match.id !== matchId));
      toast.success("Match supprimé avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du match:", error);
      return handleError(error);
    }
  }, []);

  const fetchMatches = useCallback(async (date) => {
    setLoading(true);
    try {
      const response = await getData(`v1/matches?date=${date}`);
      if (!response) {
        toast.error("Une erreur est survenue lors du chargement des matchs");
        setMatches([]);
        return;
      }

      setMatches(response.matches || []);
    } catch (error) {
      console.error("Erreur lors du chargement des matchs:", error);
      handleError(error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    matches,
    loading,
    addMatch,
    updateMatch,
    deleteMatch,
    fetchMatches,
    setMatches,
  };
};
