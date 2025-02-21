import { useState } from "react";
import { getData } from "@utils/api/data";

export const useCurrencyPacks = () => {
  const [currencyPacks, setCurrencyPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrencyPacks = async () => {
    setLoading(true);
    setError(null);

    const response = await getData("v1/currency_packs")
      .then((data) => {
        setCurrencyPacks(data || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setCurrencyPacks([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    currencyPacks,
    setCurrencyPacks,
    loading,
    error,
    fetchCurrencyPacks,
  };
};

