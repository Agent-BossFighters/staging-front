import { useState, useEffect } from "react";
import { getData } from "@utils/api/data";
import { useAuth } from "@context/auth.context";

// Cache global pour les currency packs
let cachedPacks = null;
let fetchPromise = null;

export const useCurrencyPacks = () => {
  const { user } = useAuth();
  const [currencyPacks, setCurrencyPacks] = useState(cachedPacks || []);
  const [loading, setLoading] = useState(!cachedPacks);
  const [error, setError] = useState(null);

  const fetchCurrencyPacks = async () => {
    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    if (cachedPacks) {
      setCurrencyPacks(cachedPacks);
      setLoading(false);
      return;
    }

    // Si une requête est déjà en cours, attendons sa résolution
    if (fetchPromise) {
      try {
        const result = await fetchPromise;
        setCurrencyPacks(result);
        return;
      } catch (err) {
        setError(err.message);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      // Créer une nouvelle promesse pour la requête
      fetchPromise = getData("v1/currency_packs");
      const payload = await fetchPromise;

      if (payload) {
        cachedPacks = payload;
        setCurrencyPacks(payload);
      } else {
        setCurrencyPacks([]);
      }
    } catch (err) {
      setError(err.message);
      setCurrencyPacks([]);
    } finally {
      setLoading(false);
      fetchPromise = null;
    }
  };

  // Charger les packs au montage du composant et quand l'état d'authentification change
  useEffect(() => {
    fetchCurrencyPacks();
  }, [user]);

  return {
    currencyPacks,
    setCurrencyPacks,
    loading,
    error,
    fetchCurrencyPacks,
  };
};
