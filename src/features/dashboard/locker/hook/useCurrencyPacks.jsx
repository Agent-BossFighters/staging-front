import { useState } from "react";
import { getData } from "@utils/api/data";

export const useCurrencyPacks = () => {
  const [currencyPacks, setCurrencyPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrencyPacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const payload = await getData("/v1/currency_packs");
      if (payload) {
        // Les packs FLEX sont déjà filtrés et formatés par le backend
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

  return { 
    currencyPacks, 
    setCurrencyPacks, 
    loading, 
    error,
    fetchCurrencyPacks 
  };
}; 