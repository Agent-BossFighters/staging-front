import RarityBadge from "./RarityBadge";
import MapIcon from "./MapIcon";
import ResultIcon from "./ResultIcon";
import ActionButtons from "./ActionButtons";

const MAX_SLOTS = 5;

export default function MatchDisplayRow({
  match,
  builds,
  isEditing,
  isCreating,
  onEdit,
  onDelete,
  onSubmit,
  onCancel,
}) {
  const currentBuild = builds.find((b) => b.buildName === match.build);
  const matchRarities = Array(MAX_SLOTS)
    .fill("none")
    .map((_, index) => {
      const badge = match.badge_used?.find((b) => b.slot === index + 1);
      return badge ? badge.rarity : "none";
    });

  return (
    <tr>
      <td className="min-w-[120px] pl-4">
        <span className="font-medium">{match.build}</span>
      </td>
      {matchRarities.map((rarity, index) => (
        <td key={index} className="text-center min-w-[60px]">
          <RarityBadge rarity={rarity} />
        </td>
      ))}
      <td className="text-center min-w-[80px]">{match.luckrate}</td>
      <td className="text-center min-w-[80px]">{match.time}</td>
      <td className="text-center min-w-[80px]">{match.energyUsed}</td>
      <td className="text-center min-w-[80px] text-destructive">
        ${match.calculated.energyCost}
      </td>
      <td className="text-center min-w-[100px] capitalize">
        <MapIcon map={match.map} />
      </td>
      <td className="text-center min-w-[80px] capitalize">
        <ResultIcon result={match.result} />
      </td>
      <td className="text-center min-w-[80px]">{match.totalToken}</td>
      <td className="text-center min-w-[80px] text-accent">
        ${match.calculated.tokenValue}
      </td>
      <td className="text-center min-w-[80px]">
        {match.totalPremiumCurrency}
      </td>
      <td className="text-center min-w-[80px] text-accent">
        ${match.calculated.premiumValue}
      </td>
      <td className="text-center min-w-[80px] text-green-500">
        ${match.calculated.profit}
      </td>
      <td className="text-center min-w-[80px]">
        {currentBuild?.bftBonus ? (
          <div className="flex flex-col">
            <span>{`${parseFloat(currentBuild.bftBonus).toFixed(1)}%`}</span>
          </div>
        ) : (
          "-"
        )}
      </td>
      <td className="flex gap-2 items-center justify-center min-w-[100px]">
        <ActionButtons
          isEditing={isEditing}
          isCreating={isCreating}
          onEdit={() => onEdit(match)}
          onDelete={() => onDelete(match.id)}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </td>
    </tr>
  );
}