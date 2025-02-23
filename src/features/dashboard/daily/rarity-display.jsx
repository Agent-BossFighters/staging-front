import data from "@shared/data/rarities.json";

const rarities = data.rarities;

export default function RarityDisplay({ rarity }) {
  if (!rarity || rarity === "none") return "-";

  // Normaliser la rareté pour la recherche
  const normalizedRarity =
    rarity.charAt(0).toUpperCase() + rarity.slice(1).toLowerCase();
  const rarityInfo = rarities.find((r) => r.rarity === normalizedRarity);

  if (!rarityInfo) return "-";

  return (
    <span style={{ color: rarityInfo.color, fontWeight: "bold" }}>
      {rarityInfo.rarity.charAt(0)}
    </span>
  );
}
