import { useMatchCalculations } from "../hook/useMatchCalculations";
import RaritySelect from "./rarity-select";
import ActionsTable from "./actions-table";
import { rarities } from "@shared/data/rarities.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";

export default function MatchRow({
  match,
  builds,
  isEditing,
  editedData,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onEditField,
}) {
  const { calculateLuckrate, calculateEnergyUsed } = useMatchCalculations();

  // Trouver le build correspondant, que ce soit en mode édition ou affichage
  const currentBuild = isEditing
    ? builds.find((b) => b.id === editedData.buildId)
    : builds.find((b) => b.buildName === match.build);

  const matchRarities =
    match.badge_used?.map((badge) => badge.rarity) ||
    match.badges?.map((badge) => badge.rarity) ||
    match.selectedRarities ||
    Array(5).fill("rare");

  const matchLuckrate = calculateLuckrate(matchRarities);
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
      {[...Array(5)].map((_, index) => {
        const rarity = isEditing
          ? editedData.rarities[index]
          : matchRarities[index];
        const rarityInfo = rarities.find(
          (r) => r.rarity.toLowerCase() === (rarity || "rare").toLowerCase()
        );

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
                {(rarity || "rare").charAt(0).toUpperCase()}
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
        <ActionsTable
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
