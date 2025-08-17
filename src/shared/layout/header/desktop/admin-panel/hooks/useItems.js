import { useState, useEffect } from "react";
import { kyInstance } from "@utils/api/ky-config";
import toast from "react-hot-toast";

export const useItems = (user) => {
  const [items, setItems] = useState([]);
  const [itemCraftings, setItemCraftings] = useState([]);
  const [itemRecharges, setItemRecharges] = useState([]);
  const [itemValues, setItemValues] = useState({});
  const [craftingValues, setCraftingValues] = useState({});
  const [rechargeValues, setRechargeValues] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [forgeSettings, setForgeSettings] = useState([]);
  const [forgeValues, setForgeValues] = useState({});
  const [perksSettings, setPerksSettings] = useState([]);
  const [perksValues, setPerksValues] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch items
        const itemsResponse = await kyInstance.get('v1/admin/items').json();

        const sortedItems = [...itemsResponse].sort((a, b) => a.id - b.id);
        setItems(sortedItems);

        // Initialize item floor price values
        const initialValues = {};
        sortedItems.forEach(item => {
          initialValues[item.id] = item.floorPrice || 0;
        });
        setItemValues(initialValues);

        // Fetch item craftings
        const craftingsResponse = await kyInstance.get('v1/admin/item_crafting').json();

        setItemCraftings(craftingsResponse);

        // Initialize crafting values
        const initialCraftingValues = {};
        craftingsResponse.forEach(crafting => {
          initialCraftingValues[crafting.id] = {
            unit_to_craft: crafting.unit_to_craft === null ? '' : crafting.unit_to_craft,
            flex_craft: crafting.flex_craft === null ? '' : crafting.flex_craft,
            sponsor_mark_craft: crafting.sponsor_mark_craft === null ? '' : crafting.sponsor_mark_craft,
            sponsor_marks_reward: crafting.sponsor_marks_reward === null ? '' : crafting.sponsor_marks_reward,
            craft_tokens: crafting.craft_tokens === null ? '' : crafting.craft_tokens,
            nb_lower_badge_to_craft: crafting.nb_lower_badge_to_craft === null ? '' : crafting.nb_lower_badge_to_craft,
            craft_time: crafting.craft_time === null ? '' : crafting.craft_time,
            max_level: crafting.max_level === null ? '' : crafting.max_level
          };
        });
        setCraftingValues(initialCraftingValues);

        // Fetch forge settings
        const forgeResponse = await kyInstance.get('v1/admin/forge_settings').json();
        setForgeSettings(forgeResponse);
        const initialForgeValues = {};
        forgeResponse.forEach((s) => {
          initialForgeValues[s.id] = {
            rarity_id: s.rarity_id,
            operation_type: s.operation_type,
            supply: s.supply ?? '',
            nb_previous_required: s.nb_previous_required ?? '',
            nb_digital_required: s.nb_digital_required ?? '',
            cash: s.cash ?? '',
            fusion_core: s.fusion_core ?? '',
            bft_tokens: s.bft_tokens ?? '',
            sponsor_marks_reward: s.sponsor_marks_reward ?? ''
          };
        });
        setForgeValues(initialForgeValues);

        // Fetch item recharges
        const rechargesResponse = await kyInstance.get('v1/admin/item_recharge').json();
        setItemRecharges(rechargesResponse);

        // Initialize recharge values
        const initialRechargeValues = {};
        rechargesResponse.forEach(recharge => {
          initialRechargeValues[recharge.id] = {
            max_energy_recharge: recharge.max_energy_recharge === null ? '' : recharge.max_energy_recharge,
            time_to_charge: recharge.time_to_charge === null ? '' : recharge.time_to_charge,
            flex_charge: recharge.flex_charge === null ? '' : recharge.flex_charge,
            sponsor_mark_charge: recharge.sponsor_mark_charge === null ? '' : recharge.sponsor_mark_charge,
            unit_charge: recharge.unit_charge_cost === null ? '' : recharge.unit_charge_cost,
            max_charge: recharge.max_charge_cost === null ? '' : recharge.max_charge_cost
          };
        });
        setRechargeValues(initialRechargeValues);

        // Fetch perks lock settings
        const perksResp = await kyInstance.get('v1/admin/perks_lock_settings').json();
        setPerksSettings(perksResp);
        const initialPerksValues = {};
        perksResp.forEach((p) => {
          initialPerksValues[p.id] = {
            rarity_id: p.rarity_id,
            star_0: p.star_0 ?? '',
            star_1: p.star_1 ?? '',
            star_2: p.star_2 ?? '',
            star_3: p.star_3 ?? ''
          };
        });
        setPerksValues(initialPerksValues);

      } catch (error) {
        console.error('Error fetching data:', error);
        const errorMessage = error.responseData?.error || 'Failed to fetch data. Please try again.';
        toast.error(errorMessage);
      }
    };

    if (user && user.is_admin === true) {
      fetchAllData();
    }
  }, [user]);

  const handleItemValueChange = (itemId, value) => {
    const numericValue = parseFloat(value);
    setItemValues(prev => ({
      ...prev,
      [itemId]: isNaN(numericValue) ? 0 : numericValue
    }));
  };

  const handleCraftingValueChange = (craftingId, field, value) => {
    setCraftingValues(prev => ({
      ...prev,
      [craftingId]: {
        ...prev[craftingId],
        [field]: value === '' ? '' : isNaN(value) ? 0 : Number(value)
      }
    }));
  };

  const handleForgeValueChange = (settingId, field, value) => {
    setForgeValues(prev => ({
      ...prev,
      [settingId]: {
        ...prev[settingId],
        [field]: value === '' ? '' : isNaN(value) || ['operation_type'].includes(field) ? value : Number(value)
      }
    }));
  };

  const handlePerksValueChange = (settingId, field, value) => {
    setPerksValues(prev => ({
      ...prev,
      [settingId]: {
        ...prev[settingId],
        [field]: value === '' ? '' : isNaN(value) ? 0 : Number(value)
      }
    }));
  };

  const handleRechargeValueChange = (rechargeId, field, value) => {
    const numericValue = parseFloat(value);
    setRechargeValues(prev => ({
      ...prev,
      [rechargeId]: {
        ...prev[rechargeId],
        [field]: isNaN(numericValue) ? 0 : numericValue
      }
    }));
  };

  const handleSaveCraftings = async (onSuccess) => {
    try {
      setIsUpdating(true);
      
      const invalidValues = [];
      
      // Vérifier que toutes les valeurs sont valides
      for (const crafting of itemCraftings) {
        const values = craftingValues[crafting.id];
        for (const [key, value] of Object.entries(values)) {
          if (value !== '' && (isNaN(value) || value < 0)) {
            invalidValues.push(`${crafting.item.name} - ${key}`);
          }
        }
      }
      
      if (invalidValues.length > 0) {
        toast.error(`Invalid values for: ${invalidValues.join(', ')}. All values must be greater than or equal to zero.`);
        return false;
      }
      
      // Mettre à jour chaque crafting
      for (const crafting of itemCraftings) {
        const values = craftingValues[crafting.id];
        const originalValues = {
          unit_to_craft: crafting.unit_to_craft,
          flex_craft: crafting.flex_craft,
          sponsor_mark_craft: crafting.sponsor_mark_craft,
          sponsor_marks_reward: crafting.sponsor_marks_reward,
          craft_tokens: crafting.craft_tokens,
          nb_lower_badge_to_craft: crafting.nb_lower_badge_to_craft,
          craft_time: crafting.craft_time,
          max_level: crafting.max_level
        };

        // Ne créer l'objet de mise à jour que pour les champs modifiés
        const updateValues = {};
        if (values.unit_to_craft !== '' && values.unit_to_craft !== originalValues.unit_to_craft) {
          updateValues.unit_to_craft = values.unit_to_craft === '' ? null : Number(values.unit_to_craft);
        }
        if (values.flex_craft !== '' && values.flex_craft !== originalValues.flex_craft) {
          updateValues.flex_craft = values.flex_craft === '' ? null : Number(values.flex_craft);
        }
        if (values.sponsor_mark_craft !== '' && values.sponsor_mark_craft !== originalValues.sponsor_mark_craft) {
          updateValues.sponsor_mark_craft = values.sponsor_mark_craft === '' ? null : Number(values.sponsor_mark_craft);
        }
        if (values.sponsor_marks_reward !== '' && values.sponsor_marks_reward !== originalValues.sponsor_marks_reward) {
          updateValues.sponsor_marks_reward = values.sponsor_marks_reward === '' ? null : Number(values.sponsor_marks_reward);
        }
        if (values.craft_tokens !== '' && values.craft_tokens !== originalValues.craft_tokens) {
          updateValues.craft_tokens = values.craft_tokens === '' ? null : Number(values.craft_tokens);
        }
        if (values.nb_lower_badge_to_craft !== '' && values.nb_lower_badge_to_craft !== originalValues.nb_lower_badge_to_craft) {
          updateValues.nb_lower_badge_to_craft = values.nb_lower_badge_to_craft === '' ? null : Number(values.nb_lower_badge_to_craft);
        }
        if (values.craft_time !== '' && values.craft_time !== originalValues.craft_time) {
          updateValues.craft_time = values.craft_time === '' ? null : Number(values.craft_time);
        }
        if (values.max_level !== '' && values.max_level !== originalValues.max_level) {
          updateValues.max_level = values.max_level === '' ? null : Number(values.max_level);
        }

        // Ne faire la mise à jour que si des champs ont été modifiés
        if (Object.keys(updateValues).length > 0) {
          await kyInstance.patch(`v1/admin/item_crafting/${crafting.id}`, {
            json: {
              item_crafting: updateValues
            }
          });
        }
      }
      
      // Rafraîchir les données
      const updatedCraftings = await kyInstance.get('v1/admin/item_crafting').json();
      setItemCraftings(updatedCraftings);
      
      // Initialiser les nouvelles valeurs
      const initialCraftingValues = {};
      updatedCraftings.forEach(crafting => {
        initialCraftingValues[crafting.id] = {
          unit_to_craft: crafting.unit_to_craft === null ? '' : crafting.unit_to_craft,
          flex_craft: crafting.flex_craft === null ? '' : crafting.flex_craft,
          sponsor_mark_craft: crafting.sponsor_mark_craft === null ? '' : crafting.sponsor_mark_craft,
          sponsor_marks_reward: crafting.sponsor_marks_reward === null ? '' : crafting.sponsor_marks_reward,
          craft_tokens: crafting.craft_tokens === null ? '' : crafting.craft_tokens,
          nb_lower_badge_to_craft: crafting.nb_lower_badge_to_craft === null ? '' : crafting.nb_lower_badge_to_craft,
          craft_time: crafting.craft_time === null ? '' : crafting.craft_time,
          max_level: crafting.max_level === null ? '' : crafting.max_level
        };
      });
      setCraftingValues(initialCraftingValues);
      
      toast.success('Crafting settings updated successfully!');
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      const errorMessage = error.message || error.responseData?.error || 'Failed to update crafting settings. Please try again.';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveForge = async (onSuccess) => {
    try {
      setIsUpdating(true);

      for (const setting of forgeSettings) {
        const values = forgeValues[setting.id];
        const updateValues = {};
        for (const key of [
          'supply','nb_previous_required','nb_digital_required','cash','fusion_core','bft_tokens','sponsor_marks_reward'
        ]) {
          // Autoriser la mise à jour à null si l'admin vide le champ
          if (values[key] === '' && setting[key] !== null) {
            updateValues[key] = null;
          } else if (values[key] !== '' && values[key] !== setting[key]) {
            updateValues[key] = Number(values[key]);
          }
        }
        if (Object.keys(updateValues).length > 0) {
          await kyInstance.patch(`v1/admin/forge_settings/${setting.id}`, { json: { forge_setting: updateValues } });
        }
      }

      const updated = await kyInstance.get('v1/admin/forge_settings').json();
      setForgeSettings(updated);
      const refreshed = {};
      updated.forEach((s) => {
        refreshed[s.id] = {
          rarity_id: s.rarity_id,
          operation_type: s.operation_type,
          supply: s.supply ?? '',
          nb_previous_required: s.nb_previous_required ?? '',
          nb_digital_required: s.nb_digital_required ?? '',
          cash: s.cash ?? '',
          fusion_core: s.fusion_core ?? '',
          bft_tokens: s.bft_tokens ?? '',
          sponsor_marks_reward: s.sponsor_marks_reward ?? ''
        };
      });
      setForgeValues(refreshed);

      toast.success('Forge settings updated successfully!');
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('forge-settings-updated'));
        }
      } catch (e) {
        // noop
      }
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      const errorMessage = error.message || error.responseData?.error || 'Failed to update forge settings. Please try again.';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSavePerks = async (onSuccess) => {
    try {
      setIsUpdating(true);
      for (const setting of perksSettings) {
        const values = perksValues[setting.id];
        const updateValues = {};
        for (const key of ['star_0','star_1','star_2','star_3']) {
          if (values[key] !== '' && values[key] !== setting[key]) {
            updateValues[key] = values[key] === '' ? null : Number(values[key]);
          }
        }
        if (Object.keys(updateValues).length > 0) {
          await kyInstance.patch(`v1/admin/perks_lock_settings/${setting.id}`, { json: { perks_lock_setting: updateValues } });
        }
      }
      const updated = await kyInstance.get('v1/admin/perks_lock_settings').json();
      setPerksSettings(updated);
      const refreshed = {};
      updated.forEach((p) => {
        refreshed[p.id] = {
          rarity_id: p.rarity_id,
          star_0: p.star_0 ?? '',
          star_1: p.star_1 ?? '',
          star_2: p.star_2 ?? '',
          star_3: p.star_3 ?? ''
        };
      });
      setPerksValues(refreshed);
      toast.success('Perks lock settings updated successfully!');
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('perks-lock-updated'));
        }
      } catch (e) {
        // noop
      }
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      const errorMessage = error.message || error.responseData?.error || 'Failed to update perks lock settings. Please try again.';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveRecharges = async (onSuccess) => {
    try {
      setIsUpdating(true);
      
      const invalidValues = [];
      
      // Vérifier que toutes les valeurs sont valides
      for (const recharge of itemRecharges) {
        const values = rechargeValues[recharge.id];
        for (const [key, value] of Object.entries(values)) {
          if (value !== '' && (isNaN(value) || value < 0)) {
            invalidValues.push(`${recharge.item.name} - ${key}`);
          }
        }
      }
      
      if (invalidValues.length > 0) {
        toast.error(`Invalid values for: ${invalidValues.join(', ')}. All values must be greater than or equal to zero.`);
        return false;
      }
      
      // Mettre à jour chaque recharge
      for (const recharge of itemRecharges) {
        const values = rechargeValues[recharge.id];
        const originalValues = {
          max_energy_recharge: recharge.max_energy_recharge,
          time_to_charge: recharge.time_to_charge,
          flex_charge: recharge.flex_charge,
          sponsor_mark_charge: recharge.sponsor_mark_charge,
          unit_charge_cost: recharge.unit_charge_cost,
          max_charge_cost: recharge.max_charge_cost
        };

        // Ne créer l'objet de mise à jour que pour les champs modifiés
        const updateValues = {};
        if (values.max_energy_recharge !== '' && values.max_energy_recharge !== originalValues.max_energy_recharge) {
          updateValues.max_energy_recharge = values.max_energy_recharge === '' ? null : Number(values.max_energy_recharge);
        }
        if (values.time_to_charge !== '' && values.time_to_charge !== originalValues.time_to_charge) {
          updateValues.time_to_charge = values.time_to_charge === '' ? null : Number(values.time_to_charge);
        }
        if (values.flex_charge !== '' && values.flex_charge !== originalValues.flex_charge) {
          updateValues.flex_charge = values.flex_charge === '' ? null : Number(values.flex_charge);
        }
        if (values.sponsor_mark_charge !== '' && values.sponsor_mark_charge !== originalValues.sponsor_mark_charge) {
          updateValues.sponsor_mark_charge = values.sponsor_mark_charge === '' ? null : Number(values.sponsor_mark_charge);
        }
        if (values.unit_charge !== '' && values.unit_charge !== originalValues.unit_charge_cost) {
          updateValues.unit_charge_cost = values.unit_charge === '' ? null : Number(values.unit_charge);
        }
        if (values.max_charge !== '' && values.max_charge !== originalValues.max_charge_cost) {
          updateValues.max_charge_cost = values.max_charge === '' ? null : Number(values.max_charge);
        }

        // Ne faire la mise à jour que si des champs ont été modifiés
        if (Object.keys(updateValues).length > 0) {
          await kyInstance.patch(`v1/admin/item_recharge/${recharge.id}`, {
            json: {
              item_recharge: updateValues
            }
          });
        }
      }
      
      // Rafraîchir les données
      const updatedRecharges = await kyInstance.get('v1/admin/item_recharge').json();
      setItemRecharges(updatedRecharges);
      
      // Initialiser les nouvelles valeurs
      const initialRechargeValues = {};
      updatedRecharges.forEach(recharge => {
        initialRechargeValues[recharge.id] = {
          max_energy_recharge: recharge.max_energy_recharge === null ? '' : recharge.max_energy_recharge,
          time_to_charge: recharge.time_to_charge === null ? '' : recharge.time_to_charge,
          flex_charge: recharge.flex_charge === null ? '' : recharge.flex_charge,
          sponsor_mark_charge: recharge.sponsor_mark_charge === null ? '' : recharge.sponsor_mark_charge,
          unit_charge: recharge.unit_charge_cost === null ? '' : recharge.unit_charge_cost,
          max_charge: recharge.max_charge_cost === null ? '' : recharge.max_charge_cost
        };
      });
      setRechargeValues(initialRechargeValues);
      
      toast.success('Recharge settings updated successfully!');
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      const errorMessage = error.message || error.responseData?.error || 'Failed to update recharge settings. Please try again.';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
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
    itemCraftings,
    itemRecharges,
    craftingValues,
    rechargeValues,
    handleItemValueChange,
    handleCraftingValueChange,
    handleRechargeValueChange,
    handleSaveItems,
    handleSaveBadges,
    handleSaveContracts,
    handleSaveCraftings,
    handleSaveRecharges
    ,forgeSettings
    ,forgeValues
    ,handleForgeValueChange
    ,handleSaveForge
    ,perksSettings
    ,perksValues
    ,handlePerksValueChange
    ,handleSavePerks
  };
};

export default useItems; 