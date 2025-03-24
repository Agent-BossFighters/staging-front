import { useState, useEffect } from "react";
import { kyInstance } from "@utils/api/ky-config";
import toast from "react-hot-toast";

export const useItems = (user) => {
  const [items, setItems] = useState([]);
  const [itemValues, setItemValues] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await kyInstance.get('v1/admin/items').json();
        // Tri par ID
        const sortedItems = [...response].sort((a, b) => a.id - b.id);
        setItems(sortedItems);

        const initialValues = {};
        sortedItems.forEach(item => {
          initialValues[item.id] = item.floorPrice;
        });
        setItemValues(initialValues);
      } catch (error) {
        const errorMessage = error.responseData?.error || 'Failed to fetch items. Please try again.';
        toast.error(errorMessage);
      }
    };

    if (user && user.is_admin === true) {
      fetchItems();
    }
  }, [user]);

  const handleItemValueChange = (itemId, value) => {
    setItemValues(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const handleSaveItems = async (itemType, onSuccess) => {
    try {
      setIsUpdating(true);
      
      // Filtrer les items par type
      const filteredItems = items.filter(item => item.type && item.type.name === itemType);
      const invalidValues = [];
      
      // Vérifier que toutes les valeurs sont valides
      for (const item of filteredItems) {
        const newValue = parseFloat(itemValues[item.id]);
        if (isNaN(newValue) || newValue <= 0) {
          invalidValues.push(item.name);
        }
      }
      
      if (invalidValues.length > 0) {
        toast.error(`Invalid values for: ${invalidValues.join(', ')}. All values must be greater than zero.`);
        return false;
      }
      
      // Mettre à jour chaque floor price
      for (const item of filteredItems) {
        const newValue = parseFloat(itemValues[item.id]);
        
        if (newValue !== item.floorPrice) {
          await kyInstance.patch(`v1/admin/items/${item.id}`, {
            json: {
              item: {
                floorPrice: newValue
              }
            }
          });
        }
      }
      
      // Rafraîchir la liste des items
      const updatedItems = await kyInstance.get('v1/admin/items').json();
      
      // Trier par ID
      const sortedItems = [...updatedItems].sort((a, b) => a.id - b.id);
      setItems(sortedItems);
      
      // Mettre à jour les valeurs affichées
      const updatedItemValues = {};
      sortedItems.forEach(item => {
        updatedItemValues[item.id] = item.floorPrice;
      });
      setItemValues(updatedItemValues);
      
      toast.success(`${itemType} floor prices updated successfully!`);
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      const errorMessage = error.message || error.responseData?.error || `Failed to update ${itemType.toLowerCase()} prices. Please try again.`;
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Fonction spécifique pour les badges
  const handleSaveBadges = async (onSuccess) => {
    return handleSaveItems("Badge", onSuccess);
  };

  // Fonction spécifique pour les contrats
  const handleSaveContracts = async (onSuccess) => {
    return handleSaveItems("Contract", onSuccess);
  };

  // Filtrer les items par type et trier par ID
  const getBadges = () => {
    const badges = items.filter(item => item.type && item.type.name === "Badge");
    return [...badges].sort((a, b) => a.id - b.id);
  };
  
  const getContracts = () => {
    const contracts = items.filter(item => item.type && item.type.name === "Contract");
    return [...contracts].sort((a, b) => a.id - b.id);
  };

  return {
    items,
    badges: getBadges(),
    contracts: getContracts(),
    itemValues,
    isUpdating,
    handleItemValueChange,
    handleSaveItems,
    handleSaveBadges,
    handleSaveContracts
  };
};

export default useItems; 