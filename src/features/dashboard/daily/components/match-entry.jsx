import RaritySelect from "@features/dashboard/daily/components/rarity-select";
import MatchActions from "@features/dashboard/daily/components/match-actions";
import { rarities } from "@shared/data/rarities.json";
import { useUserPreference } from "@context/userPreference.context";
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
  const { calculateLuckrate, calculateEnergyUsed } = useUserPreference();

  // Trouver le build correspondant, que ce soit en mode édition ou affichage
  const currentBuild = isEditing
    ? builds.find((b) => b.id === editedData.buildId)
    : builds.find((b) => b.buildName === match.build);

  // Créer un tableau de la taille unlockedSlots rempli de "none"
  // Puis remplacer les valeurs avec les badges utilisés
  const matchRarities = Array(unlockedSlots).fill("none");
  if (match.badge_used) {
    match.badge_used.forEach(badge => {
      if (badge.slot <= unlockedSlots) {
        matchRarities[badge.slot - 1] = badge.rarity;
      }
    });
  }

  // Ne calculer le luckrate que pour les slots qui ne sont pas "none"
  const matchLuckrate = calculateLuckrate(matchRarities.filter(r => r !== "none"));
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
      <td>
        {isEditing ? (
          <Select
            value={editedData.buildId}
            onValueChange={(value) => onEditField("buildId", value)}
          >
            <SelectTrigger>
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
          enrichedMatch.build.buildName
        )}
      </td>
      {[...Array(unlockedSlots)].map((_, index) => {
        const rarity = isEditing
          ? editedData.rarities[index]
          : matchRarities[index];
        const rarityInfo = rarity === "none" 
          ? { color: "#666666" } 
          : rarities.find(r => r.rarity.toLowerCase() === rarity.toLowerCase());

        return (
          <td key={index}>
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
              <span style={{ color: rarityInfo?.color }}>
                {rarity === "none" ? "-" : rarity.charAt(0).toUpperCase()}
              </span>
            )}
          </td>
        );
      })}
      <td>{matchLuckrate}</td>
      <td>{enrichedMatch.time || 0}</td>
      <td>{matchEnergyUsed}</td>
      <td>${(matchEnergyUsed * 1.49).toFixed(2)}</td>
      <td>{enrichedMatch.map}</td>
      <td>{enrichedMatch.result}</td>
      <td>{enrichedMatch.totalToken || 0}</td>
      <td>${((enrichedMatch.totalToken || 0) * 0.01).toFixed(2)}</td>
      <td>{enrichedMatch.totalPremiumCurrency || 0}</td>
      <td>
        ${((enrichedMatch.totalPremiumCurrency || 0) * 0.00744).toFixed(2)}
      </td>
      <td className="text-green-500">
        $
        {(
          (enrichedMatch.totalToken || 0) * 0.01 +
          (enrichedMatch.totalPremiumCurrency || 0) * 0.00744 -
          matchEnergyUsed * 1.49
        ).toFixed(2)}
      </td>
      <td>{enrichedMatch.build.bonusMultiplier}</td>
      <td>{enrichedMatch.build.perksMultiplier}</td>
      <td className="flex gap-2 items-center">
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
