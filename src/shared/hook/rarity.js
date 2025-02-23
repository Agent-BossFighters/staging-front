import { getData } from "@utils/api/data";
import data from "@shared/data/rarities.json";

export const handleSelectRarityContract = async (
  setSelectedContract,
  rarity
) => {
  const payload = await getData("v1/showrunner_contracts");
  const contracts = payload.contracts;
  if (!contracts || contracts.length === 0) {
    console.warn("No contract available.");
    setSelectedContract(null);
    return;
  }
  const contract = contracts.find((c) => {
    if (!c?.rarity?.name) {
      console.warn("Contrat invalide:", c);
      return false;
    }
    return c.rarity.name.toLowerCase().trim() === rarity.toLowerCase().trim();
  });
  setSelectedContract(contract ? contract : null);
};

export const handleSelectRarityContractForEdit = async (
  setEditedName,
  rarity
) => {
  const payload = await getData("v1/showrunner_contracts");
  const contracts = payload.contracts;

  if (!contracts || contracts.length === 0) {
    console.warn("No contract available.");
    setEditedName(""); // Réinitialise le nom si aucun contrat trouvé
    return;
  }

  const contract = contracts.find((c) => {
    if (!c?.rarity?.name) {
      console.warn("Contrat invalide:", c);
      return false;
    }
    return c.rarity.name.toLowerCase().trim() === rarity.toLowerCase().trim();
  });
  contract.itemId = contract.id;

  setEditedName(contract ? contract : "");
};

// Rarity for Badges
export const handleSelectRarityBadges = async (setSelectedBadge, rarity) => {
  const payload = await getData("v1/badges");
  const badges = payload.badges;
  if (!badges || badges.length === 0) {
    console.warn("No badge available.");
    setSelectedBadge(null);
    return;
  }
  const badge = badges.find((b) => {
    if (!b?.rarity?.name) {
      console.warn("invalide Badges:", b);
      return false;
    }
    return b.rarity.name.toLowerCase().trim() === rarity.toLowerCase().trim();
  });
  setSelectedBadge(badge ? badge : null);
};

export const handleSelectRarityBadgeForEdit = async (setEditedName, rarity) => {
  const payload = await getData("v1/badges");
  const badges = payload.badges;

  if (!badges || badges.length === 0) {
    console.warn("No badges available.");
    setEditedName(""); // Réinitialise le nom si aucun contrat trouvé
    return;
  }

  const badge = badges.find((b) => {
    if (!b?.rarity?.name) {
      console.warn("Badges invalide:", b);
      return false;
    }
    return b.rarity.name.toLowerCase().trim() === rarity.toLowerCase().trim();
  });

  badge.itemId = badge.id;

  setEditedName(badge ? badge : "");
};

export const getRarityOrder = (rarity) => {
  const raritiesData = data.rarities.find((item) => item.rarity === rarity);
  return raritiesData ? raritiesData.order : Infinity;
};
