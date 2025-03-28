import RarityBadge from "./RarityBadge";
import MapIcon from "./MapIcon";
import ResultIcon from "./ResultIcon";
import ActionButtons from "./ActionButtons";
import { useUserPreference } from "@context/userPreference.context";
import { formatPrice, formatNumber, formatPercent } from "@utils/formatters";

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
  const { streamerMode } = useUserPreference();
  const currentBuild = builds.find((b) => b.buildName === match.build);
  const matchRarities = Array(MAX_SLOTS)
    .fill("none")
    .map((_, index) => {
      const badge = match.badge_used?.find((b) => b.slot === index + 1);
      return badge ? badge.rarity : "none";
    });

  return (
    <tr>
      <td className="min-w-[6%] pl-4 select-none" title={match.build}>
        <span className="font-medium">{match.build.length < 10 ? match.build : match.build.slice(0, 10) + "..."}</span>
      </td>
      <td className="px-4 text-left min-w-[4%]">
        {currentBuild?.bftBonus ? (
          <div className="flex flex-col">
            <span>{formatPercent(currentBuild.bftBonus, 2)}</span>
          </div>
        ) : (
          "-"
        )}
      </td>
      {matchRarities.map((rarity, index) => (
        <td key={index} className="px-6 text-left min-w-[4%]" title={rarity}>
          <RarityBadge rarity={rarity} />
        </td>
      ))}
      <td className="px-4 text-left min-w-[4%]">{formatNumber(match.luckrate)}</td>
      <td className="px-4 text-left min-w-[4%]">{formatNumber(match.time)}</td>
      <td className="px-4 text-left min-w-[4%]">{formatNumber(match.energyUsed, 2)}</td>
      
      {/* Masquer les colonnes financières en mode streamer */}
      {!streamerMode && (
        <>
          <td className="px-4 text-left min-w-[4%] text-destructive">
            {formatPrice(match.calculated.energyCost)}
          </td>
        </>
      )}
      
      <td className="px-6 text-left min-w-[4%] capitalize" title={match.map}>
        <MapIcon map={match.map} />
      </td>
      <td className="px-6 text-left min-w-[4%] capitalize" title={match.result}>
        <ResultIcon result={match.result} />
      </td>
      <td className="px-4 text-left min-w-[4%]">{formatNumber(match.totalToken)}</td>
      
      {/* Masquer les colonnes financières en mode streamer */}
      {!streamerMode && (
        <>
          <td className="px-4 text-left min-w-[4%] text-accent">
            {formatPrice(match.calculated.tokenValue)}
          </td>
        </>
      )}
      
      <td className="px-4 text-left min-w-[4%]">{formatNumber(Math.round(match.totalToken / match.time))}</td>


      {/* Masquer les colonnes financières en mode streamer */}
      {!streamerMode && (
        <>
          <td className="px-4 text-left min-w-[4%]">{formatPrice(match.calculated.tokenValue / match.time)}</td>
        </>
      )}

      <td className="px-4 text-left min-w-[3%]">{formatNumber(match.totalPremiumCurrency)}</td>
      
      {/* Masquer les colonnes financières en mode streamer */}
      {!streamerMode && (
        <>
          <td className="px-4 text-left min-w-[4%] text-accent">
            {formatPrice(match.calculated.premiumValue)}
          </td>
          <td className="px-4 text-left min-w-[5%] text-accent">
            {formatPrice(match.calculated.profit)}
          </td>
        </>
      )}
      
      <td className="px-1 flex gap-2 items-left justify-left min-w-[6%]">
        <ActionButtons
          isEditing={isEditing}
          isCreating={isCreating}
          onEdit={() => onEdit(match)}
          onDelete={() => onDelete(match.id)}
          onSubmit={onSubmit}
          onCancel={onCancel}
          editDisabled={true}
        />
      </td>
    </tr>
  );
}
