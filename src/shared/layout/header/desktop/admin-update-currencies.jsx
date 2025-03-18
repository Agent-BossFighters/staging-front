import { useState, useEffect } from "react";
import { useGameConstants } from "@context/gameConstants.context";
import { useAuth } from "@context/auth.context";
import { kyInstance } from "@utils/api/ky-config";
import toast from "react-hot-toast";
import { Button } from "@shared/ui/button";

export default function AdminUpdateCurrencies() {
  const { user } = useAuth();
  const { fetchCurrencyRates } = useGameConstants();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [currencyValues, setCurrencyValues] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Récupérer la liste des devises au chargement du composant
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await kyInstance.get('v1/admin/currencies').json();
        setCurrencies(response);
        
        // Initialiser les valeurs des devises
        const initialValues = {};
        response.forEach(currency => {
          initialValues[currency.id] = currency.price;
        });
        setCurrencyValues(initialValues);
      } catch (error) {
        const errorMessage = error.responseData?.error || 'Failed to update currencies. Please try again.';
        toast.error(errorMessage);
      }
    };

    if (user && user.is_admin === true) {
      fetchCurrencies();
    }
  }, [user]);

  if (!user || user.is_admin !== true) return null;

  const handleUpdateClick = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    
    // Réinitialiser les valeurs aux valeurs actuelles
    const resetValues = {};
    currencies.forEach(currency => {
      resetValues[currency.id] = currency.price;
    });
    setCurrencyValues(resetValues);
  };

  const handleValueChange = (currencyId, value) => {
    setCurrencyValues(prev => ({
      ...prev,
      [currencyId]: value
    }));
  };

  const handleSaveChanges = async () => {
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
        return;
      }
      
      // Mettre à jour chaque devise
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
      
      // Rafraîchir la liste des devises
      const updatedCurrencies = await kyInstance.get('v1/admin/currencies').json();
      setCurrencies(updatedCurrencies);
      
      // Mettre à jour les valeurs affichées
      const updatedValues = {};
      updatedCurrencies.forEach(currency => {
        updatedValues[currency.id] = currency.price;
      });
      setCurrencyValues(updatedValues);
      
      setIsEditMode(false);
      
      toast.success('Currencies updated successfully!');
    } catch (error) {
      const errorMessage = error.message || error.responseData?.error || 'Failed to update currencies. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
    // window.location.reload();
  };

  return (
    <div className="ml-4 relative">
      <Button
        onClick={handleUpdateClick}
      >
        Update Currencies
      </Button>
      
      {isEditMode && (
        <div 
          className="absolute top-full left-0 mt-2 z-50 bg-gray-800 p-4 rounded-md border border-gray-700 w-64 shadow-lg"
        >
          <h3 className="text-white text-sm font-medium mb-3 uper">Update Currency Rates</h3>
          
          <div className="max-h-80 overflow-y-auto">
            {currencies.map(currency => (
              <div key={currency.id} className="mb-3">
                <label className="block text-gray-300 text-xs mb-1">
                  {currency.name} Rate ($)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={currencyValues[currency.id] || ''}
                  onChange={(e) => handleValueChange(currency.id, e.target.value)}
                  className="w-full px-2 py-1 text-sm bg-gray-700 text-white border border-gray-600 rounded"
                />
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSaveChanges}
              disabled={isUpdating}
              className="px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isUpdating}
              className="px-3 py-1 text-xs font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}