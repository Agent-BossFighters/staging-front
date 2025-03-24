import { useState, useEffect } from "react";
import { useGameConstants } from "@context/gameConstants.context";
import { kyInstance } from "@utils/api/ky-config";
import toast from "react-hot-toast";

// Liste des devises autorisées à être modifiées
const ALLOWED_CURRENCIES = ["$BFT", "Sponsor Marks"];

export const useCurrencies = (user) => {
  const { fetchCurrencyRates } = useGameConstants();
  const [currencies, setCurrencies] = useState([]);
  const [currencyValues, setCurrencyValues] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await kyInstance.get('v1/admin/currencies').json();
        // Filtrer uniquement les devises autorisées
        const allowedCurrencies = response.filter(currency => 
          ALLOWED_CURRENCIES.includes(currency.name)
        );
        
        // Trier par ID
        const sortedCurrencies = [...allowedCurrencies].sort((a, b) => a.id - b.id);
        setCurrencies(sortedCurrencies);
        
        // Initialiser les valeurs des devises autorisées
        const initialValues = {};
        sortedCurrencies.forEach(currency => {
          initialValues[currency.id] = currency.price;
        });
        setCurrencyValues(initialValues);
      } catch (error) {
        const errorMessage = error.responseData?.error || 'Failed to fetch currencies. Please try again.';
        toast.error(errorMessage);
      }
    };

    if (user && user.is_admin === true) {
      fetchCurrencies();
    }
  }, [user, fetchCurrencyRates]);

  const handleValueChange = (currencyId, value) => {
    setCurrencyValues(prev => ({
      ...prev,
      [currencyId]: value
    }));
  };

  const handleSaveCurrencies = async (onSuccess) => {
    try {
      setIsUpdating(true);
      
      // Vérifier que toutes les valeurs sont valides
      const invalidValues = [];
      for (const currency of currencies) {
        const newValue = parseFloat(currencyValues[currency.id]);
        if (isNaN(newValue) || newValue <= 0) {
          invalidValues.push(currency.name);
        }
      }
      
      if (invalidValues.length > 0) {
        toast.error(`Invalid values for: ${invalidValues.join(', ')}. All values must be greater than zero.`);
        return false;
      }
      
      // Mettre à jour chaque devise autorisée
      for (const currency of currencies) {
        const newValue = parseFloat(currencyValues[currency.id]);
        
        if (newValue !== currency.price) {
          await kyInstance.patch(`v1/admin/currencies/${currency.id}`, {
            json: {
              currency: {
                price: newValue
              }
            }
          });
        }
      }
      
      // Récupérer les nouvelles valeurs
      if (fetchCurrencyRates) {
        await fetchCurrencyRates();
      }
      
      // Rafraîchir la liste des devises autorisées
      const updatedCurrencies = await kyInstance.get('v1/admin/currencies').json();
      const updatedAllowedCurrencies = updatedCurrencies.filter(currency => 
        ALLOWED_CURRENCIES.includes(currency.name)
      );
      
      // Trier par ID
      const sortedCurrencies = [...updatedAllowedCurrencies].sort((a, b) => a.id - b.id);
      setCurrencies(sortedCurrencies);
      
      // Mettre à jour les valeurs affichées
      const updatedValues = {};
      sortedCurrencies.forEach(currency => {
        updatedValues[currency.id] = currency.price;
      });
      setCurrencyValues(updatedValues);
      
      toast.success('Currencies updated successfully!');
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      const errorMessage = error.message || error.responseData?.error || 'Failed to update currencies. Please try again.';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    currencies,
    currencyValues,
    isUpdating,
    handleValueChange,
    handleSaveCurrencies
  };
};

export default useCurrencies; 