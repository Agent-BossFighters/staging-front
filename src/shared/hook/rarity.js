import { getData } from "@utils/api/data";

export const handleSelectRarity = async (setSelectedContract, rarity) => {
  const contracts = await getData("/v1/showrunner_contracts");
  if (!contracts || contracts.length === 0) {
    console.warn("Aucun contrat disponible.");
    setSelectedContract(null);
    return;
  }
  const contract = contracts.find((c) => {
    if (!c?.contract?.rarity?.name) {
      console.warn("Contrat invalide:", c);
      return false;
    }
    return (
      c.contract.rarity.name.toLowerCase().trim() ===
      rarity.toLowerCase().trim()
    );
  });
  setSelectedContract(contract ? contract.contract : null);
};
