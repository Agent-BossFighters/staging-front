import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { postData, putData, deleteData, getData } from "@utils/api/data";
import { toast } from "react-hot-toast";

const UserPreferenceContext = createContext();

const STORAGE_KEY = "userPreferences";

export function useUserPreference() {
  return useContext(UserPreferenceContext);
}

export function UserPreferenceProvider({ children }) {
  // Préférences utilisateur avec initialisation depuis localStorage
  const [maxRarity, setMaxRarity] = useState(() => {
    const savedPreferences = localStorage.getItem(STORAGE_KEY);
    return savedPreferences ? JSON.parse(savedPreferences).maxRarity : null;
  });

  const [unlockedSlots, setUnlockedSlots] = useState(() => {
    const savedPreferences = localStorage.getItem(STORAGE_KEY);
    return savedPreferences ? JSON.parse(savedPreferences).unlockedSlots : 1;
  });

  const [selectedFlexPack, setSelectedFlexPack] = useState(() => {
    const savedPreferences = localStorage.getItem(STORAGE_KEY);
    return savedPreferences
      ? JSON.parse(savedPreferences).selectedFlexPack
      : null;
  });

  // État des matchs
  const [matches, setMatches] = useState([]);
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Cache
  const [cachedMatches, setCachedMatches] = useState({});
  const [cachedBuilds, setCachedBuilds] = useState(null);

  // Gestion du cache
  const cacheMatches = useCallback((date, matchesData) => {
    setCachedMatches((prev) => ({
      ...prev,
      [date.toISOString().split("T")[0]]: matchesData,
    }));
  }, []);

  const getCachedMatches = useCallback(
    (date) => {
      return cachedMatches[date.toISOString().split("T")[0]];
    },
    [cachedMatches]
  );

  const cacheBuilds = useCallback((buildsData) => {
    setCachedBuilds(buildsData);
  }, []);

  // Initialisation des données
  const fetchBuilds = useCallback(async () => {
    try {
      if (cachedBuilds) {
        setBuilds(cachedBuilds);
        return;
      }
      const response = await getData("v1/user_builds");
      if (response && response.builds) {
        setBuilds(response.builds);
        cacheBuilds(response.builds);
      } else {
        setBuilds([]);
        toast.error("Aucun build disponible");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des builds:", error);
      setBuilds([]);
      toast.error(`Erreur lors du chargement des builds: ${error.message}`);
    }
  }, [cachedBuilds, cacheBuilds]);

  const fetchMatches = useCallback(async () => {
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const cachedData = getCachedMatches(selectedDate);

      if (cachedData) {
        setMatches(cachedData);
        return;
      }

      const response = await getData(`v1/matches?date=${dateStr}`);
      if (response && response.matches) {
        setMatches(response.matches);
        cacheMatches(selectedDate, response.matches);
      } else {
        setMatches([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des matchs:", error);
      setMatches([]);
      toast.error(`Erreur lors du chargement des matchs: ${error.message}`);
    }
  }, [selectedDate, getCachedMatches, cacheMatches]);

  const initializeData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchBuilds(), fetchMatches()]);
    setLoading(false);
  }, [fetchBuilds, fetchMatches]);

  // Calculs des matchs
  const calculateLuckrate = useCallback((rarities) => {
    if (!rarities || !Array.isArray(rarities)) return 0;

    // Filtrer les slots "none" avant de calculer
    const activeRarities = rarities.filter((rarity) => rarity !== "none");

    return activeRarities.reduce((acc, rarity) => {
      switch (rarity.toLowerCase()) {
        case "common":
          return acc + 1;
        case "rare":
          return acc + 2;
        case "epic":
          return acc + 3;
        case "legendary":
          return acc + 4;
        default:
          return acc;
      }
    }, 0);
  }, []);

  const calculateEnergyUsed = useCallback((time) => {
    return time ? (parseFloat(time) * 0.1).toFixed(2) : "0.00";
  }, []);

  // Actions sur les matchs
  const handleAddMatch = useCallback(async (matchData) => {
    setLoading(true);
    try {
      const response = await postData("v1/matches", matchData);
      if (response?.match) {
        setMatches((prev) => [...prev, response.match]);
        toast.success("Match ajouté avec succès");
      } else {
        throw new Error("Réponse invalide du serveur");
      }
    } catch (error) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateMatch = useCallback(
    async (matchId, matchData) => {
      setLoading(true);
      try {
        console.log("Updating match:", matchId, matchData);
        const response = await putData(`v1/matches/${matchId}`, matchData);
        console.log("Update response:", response);

        if (!response) {
          throw new Error("Réponse invalide du serveur");
        }

        // Si la réponse est un objet avec une propriété match, utilisez-la
        // Sinon, utilisez la réponse directement
        const updatedMatch = response.match || response;

        if (!updatedMatch || !updatedMatch.id) {
          throw new Error("Format de réponse invalide");
        }

        // Mettre à jour le cache et l'état local
        setMatches((prev) => {
          const newMatches = prev.map((match) =>
            match.id === matchId ? updatedMatch : match
          );
          cacheMatches(selectedDate, newMatches);
          return newMatches;
        });

        toast.success("Match mis à jour avec succès");
      } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);

        // Gestion détaillée des erreurs
        if (error.response) {
          try {
            const errorData = await error.response.json();
            console.error("Détails de l'erreur:", errorData);
            const errorMessage =
              errorData.error || errorData.message || error.message;
            toast.error(`Erreur: ${errorMessage}`);
          } catch (e) {
            toast.error(`Erreur: ${error.message}`);
          }
        } else {
          toast.error(`Erreur: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    },
    [selectedDate, cacheMatches]
  );

  const handleDeleteMatch = useCallback(async (matchId) => {
    setLoading(true);
    try {
      await deleteData(`v1/matches/${matchId}`);
      setMatches((prev) => prev.filter((match) => match.id !== matchId));
      toast.success("Match supprimé avec succès");
    } catch (error) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const savePreferences = useCallback(() => {
    try {
      const preferences = {
        maxRarity,
        unlockedSlots,
        selectedFlexPack,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      toast.success("Préférences sauvegardées avec succès");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des préférences:", error);
      toast.error("Erreur lors de la sauvegarde des préférences");
    }
  }, [maxRarity, unlockedSlots, selectedFlexPack]);

  // Effet pour charger les données initiales
  useEffect(() => {
    initializeData();
  }, [selectedDate]);

  return (
    <UserPreferenceContext.Provider
      value={{
        // Préférences utilisateur
        maxRarity,
        setMaxRarity,
        unlockedSlots,
        setUnlockedSlots,
        selectedFlexPack,
        setSelectedFlexPack,
        savePreferences,

        // État des matchs
        matches,
        setMatches,
        builds,
        setBuilds,
        loading,
        setLoading,
        selectedDate,
        setSelectedDate,

        // Gestion du cache
        cacheMatches,
        getCachedMatches,
        cacheBuilds,
        cachedBuilds,

        // Calculs
        calculateLuckrate,
        calculateEnergyUsed,

        // Actions
        handleAddMatch,
        handleUpdateMatch,
        handleDeleteMatch,
        initializeData,
      }}
    >
      {children}
    </UserPreferenceContext.Provider>
  );
}
