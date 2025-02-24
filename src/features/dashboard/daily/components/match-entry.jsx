import RaritySelect from "@features/dashboard/daily/components/rarity-select";
import MatchActions from "@features/dashboard/daily/components/match-actions";
import { rarities } from "@shared/data/rarities.json";
import { useUserPreference } from "@context/userPreference.context";
import { useGameConstants } from "@context/gameConstants.context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";

export default function MatchEntry({
  match,
  builds,
  isEditing,
  editedData,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onEditField,
  unlockedSlots,
}) {
  const { calculateEnergyUsed } = useUserPreference();
  const { LUCK_RATES } = useGameConstants();

  // Trouver le build correspondant, que ce soit en mode édition ou affichage
  const currentBuild = isEditing
    ? builds.find((b) => b.id === editedData.buildId)
    : builds.find((b) => b.buildName === match.build);

  // Créer un tableau de la taille unlockedSlots rempli de "none"
  // Puis remplacer les valeurs avec les badges utilisés de manière séquentielle
  const matchRarities = Array(unlockedSlots).fill("none");
  if (match.badge_used) {
    // Trier les badges par slot pour assurer l'ordre
    const sortedBadges = [...match.badge_used].sort((a, b) => a.slot - b.slot);
    // Assigner les badges séquentiellement dans les slots disponibles
    sortedBadges.forEach((badge, index) => {
      if (index < unlockedSlots) {
        matchRarities[index] = badge.rarity;
      }
    });
  }

  // Calculer le luckrate en utilisant les valeurs de LUCK_RATES
  const matchLuckrate = matchRarities
    .filter((r) => r !== "none")
    .reduce((total, rarity) => {
      return total + (LUCK_RATES[rarity.toLowerCase()] || 0);
    }, 0);

  const matchEnergyUsed = calculateEnergyUsed(match.time);

  // Enrichir les données du match avec les multiplicateurs du build
  const enrichedMatch = {
    ...match,
    build: {
      ...currentBuild,
      bonusMultiplier: currentBuild?.bonusMultiplier || 1.0,
      perksMultiplier: currentBuild?.perksMultiplier || 1.0,
    },
  };

  return (
    <tr>
      <td className="min-w-[120px]">
        {isEditing ? (
          <Select
            value={editedData.buildId}
            onValueChange={(value) => onEditField("buildId", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select build" />
            </SelectTrigger>
            <SelectContent>
              {builds.map((build) => (
                <SelectItem key={build.id} value={build.id}>
                  {build.buildName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="font-medium">{enrichedMatch.build.buildName}</span>
        )}
      </td>
      {[...Array(unlockedSlots)].map((_, index) => {
        const rarity = isEditing
          ? editedData.rarities[index]
          : matchRarities[index];
        const rarityColor =
          rarity === "none"
            ? "#666666"
            : rarity === "common"
              ? "#1ee8b7"
              : rarity === "uncommon"
                ? "#1e90ff"
                : rarity === "rare"
                  ? "#9b59b6"
                  : rarity === "epic"
                    ? "#f1c40f"
                    : rarity === "legendary"
                      ? "#e67e22"
                      : rarity === "mythic"
                        ? "#e74c3c"
                        : rarity === "exalted"
                          ? "#8e44ad"
                          : rarity === "exotic"
                            ? "#2ecc71"
                            : rarity === "transcendant"
                              ? "#3498db"
                              : rarity === "unique"
                                ? "#e056fd"
                                : "#666666";

        return (
          <td key={index} className="text-center min-w-[60px]">
            {isEditing ? (
              <RaritySelect
                value={rarity}
                onChange={(value) => {
                  const newRarities = [...editedData.rarities];
                  newRarities[index] = value;
                  onEditField("rarities", newRarities);
                }}
              />
            ) : (
              <span style={{ color: rarityColor }}>
                {rarity === "none" ? "-" : rarity.charAt(0).toUpperCase()}
              </span>
            )}
          </td>
        );
      })}
      <td className="text-center min-w-[80px] font-medium">{matchLuckrate}</td>
      <td className="text-center min-w-[80px]">{enrichedMatch.time || 0}</td>
      <td className="text-center min-w-[80px]">{matchEnergyUsed}</td>
      <td className="text-center min-w-[80px] text-destructive">
        ${(matchEnergyUsed * 1.49).toFixed(2)}
      </td>
      <td className="text-center min-w-[100px] capitalize">
        {enrichedMatch.map}
      </td>
      <td className="text-center min-w-[80px] capitalize">
        {enrichedMatch.result}
      </td>
      <td className="text-center min-w-[80px]">
        {enrichedMatch.totalToken || 0}
      </td>
      <td className="text-center min-w-[80px] text-accent">
        ${((enrichedMatch.totalToken || 0) * 0.01).toFixed(2)}
      </td>
      <td className="text-center min-w-[80px]">
        {enrichedMatch.totalPremiumCurrency || 0}
      </td>
      <td className="text-center min-w-[80px] text-accent">
        ${((enrichedMatch.totalPremiumCurrency || 0) * 0.00744).toFixed(2)}
      </td>
      <td className="text-center min-w-[80px] text-green-500">
        $
        {(
          (enrichedMatch.totalToken || 0) * 0.01 +
          (enrichedMatch.totalPremiumCurrency || 0) * 0.00744 -
          matchEnergyUsed * 1.49
        ).toFixed(2)}
      </td>
      <td className="text-center min-w-[80px]">
        {enrichedMatch.build.bonusMultiplier}
      </td>
      <td className="text-center min-w-[80px]">
        {enrichedMatch.build.perksMultiplier}
      </td>
      <td className="flex gap-2 items-center justify-center min-w-[100px]">
        <MatchActions
          data={enrichedMatch}
          onEdit={onEdit}
          onDelete={onDelete}
          onSave={onSave}
          onCancel={onCancel}
          isEditing={isEditing}
        />
      </td>
    </tr>
  );
}
