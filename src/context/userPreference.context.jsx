import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { postData, deleteData, getData } from "@utils/api/data";
import { toast } from "react-hot-toast";

const UserPreferenceContext = createContext();

export function useUserPreference() {
  return useContext(UserPreferenceContext);
}

export function UserPreferenceProvider({ children }) {
  // Préférences utilisateur
  const [maxRarity, setMaxRarity] = useState(null);
  const [unlockedSlots, setUnlockedSlots] = useState(2);

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
    setCachedMatches(prev => ({
      ...prev,
      [date.toISOString().split('T')[0]]: matchesData
    }));
  }, []);

  const getCachedMatches = useCallback((date) => {
    return cachedMatches[date.toISOString().split('T')[0]];
  }, [cachedMatches]);

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
      const dateStr = selectedDate.toISOString().split('T')[0];
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
    const activeRarities = rarities.filter(rarity => rarity !== "none");
    
    return activeRarities.reduce((acc, rarity) => {
      switch (rarity.toLowerCase()) {
        case 'common': return acc + 1;
        case 'rare': return acc + 2;
        case 'epic': return acc + 3;
        case 'legendary': return acc + 4;
        default: return acc;
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
      setMatches(prev => [...prev, response.match]);
      toast.success("Match ajouté avec succès");
    } catch (error) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateMatch = useCallback(async (matchId, matchData) => {
    setLoading(true);
    try {
      const response = await postData(`v1/matches/${matchId}`, matchData);
      setMatches(prev => prev.map(match => 
        match.id === matchId ? response.match : match
      ));
      toast.success("Match mis à jour avec succès");
    } catch (error) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteMatch = useCallback(async (matchId) => {
    setLoading(true);
    try {
      await deleteData(`v1/matches/${matchId}`);
      setMatches(prev => prev.filter(match => match.id !== matchId));
      toast.success("Match supprimé avec succès");
    } catch (error) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

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