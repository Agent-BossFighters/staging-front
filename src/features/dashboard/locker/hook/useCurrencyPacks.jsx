import { useState, useEffect } from "react";
import { getData } from "@utils/api/data";

// Cache global pour les currency packs
let cachedPacks = null;

export const useCurrencyPacks = () => {
  const [currencyPacks, setCurrencyPacks] = useState(cachedPacks || []);
  const [loading, setLoading] = useState(!cachedPacks);
  const [error, setError] = useState(null);

  const fetchCurrencyPacks = async () => {
    if (cachedPacks) {
      setCurrencyPacks(cachedPacks);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const payload = await getData("v1/currency_packs");
      if (payload) {
        // Les packs FLEX sont déjà filtrés et formatés par le backend
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
    }
  };

  // Charger les packs au montage du composant
  useEffect(() => {
    fetchCurrencyPacks();
  }, []);

  return {
    currencyPacks,
    setCurrencyPacks,
    loading,
    error,
    fetchCurrencyPacks,
  };
};
