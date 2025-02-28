import rarityData from "@shared/data/rarities.json";

const getRarityColor = (rarity) => {
  const foundRarity = rarityData.rarities.find(
    (r) => r.rarity.toLowerCase() === rarity.toLowerCase()
  );
  return foundRarity?.color || "#ffffff";
};

export default function RarityBadge({ rarity }) {
  if (rarity === "none") {
    return (
      <div className="flex items-center justify-center">
        <span className="text-muted-foreground">-</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <span
        className="w-6 h-6 flex items-center justify-center text-white rounded-full border-2 leading-none"
        style={{
          borderColor: getRarityColor(rarity),
          backgroundColor: "transparent",
          fontSize: "14px",
          lineHeight: "1",
        }}
      >
        {rarity.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
