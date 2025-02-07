import { getData } from "@utils/api/data";

export const handleSelectRarity = async (setSelectedContract, rarity) => {
  const payload = await getData("/v1/showrunner_contracts");
  const contracts = payload.contracts;
  if (!contracts || contracts.length === 0) {
    console.warn("Aucun contrat disponible.");
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

export const handleSelectRarityForEdit = async (setEditedName, rarity) => {
  const payload = await getData("/v1/showrunner_contracts");
  const contracts = payload.contracts;

  if (!contracts || contracts.length === 0) {
    console.warn("Aucun contrat disponible.");
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

  setEditedName(contract ? contract : "");
};
