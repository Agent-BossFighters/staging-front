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
    <tr className="select-none">
      <td className="min-w-[6%] pl-4 select-none" title={match.build}>
        <span className="font-medium">{match.build.length < 10 ? match.build : match.build.slice(0, 10) + "..."}</span>
      </td>
      <td className="text-left min-w-[4%] pl-4">
        {currentBuild?.bftBonus ? (
          <div className="flex flex-col">
            <span>{formatPercent(currentBuild.bftBonus, 2)}</span>
          </div>
        ) : (
          "-"
        )}
      </td>
      {matchRarities.map((rarity, index) => (
        <td key={index} className="text-left min-w-[4%] pl-4" title={rarity}>
          <RarityBadge rarity={rarity} />
        </td>
      ))}
      <td className="text-left min-w-[4%] pl-4">{formatNumber(match.luckrate)}</td>
      <td className="text-left min-w-[4%] pl-4">{formatNumber(match.energyUsed)}</td>
      
      {/* Masquer les colonnes financières en mode streamer */}
      {!streamerMode && (
        <>
          <td className="text-left min-w-[4%] text-destructive pl-4">
            {formatPrice(match.energyCost)}
          </td>
        </>
      )}
      
      <td className="text-left min-w-[4%] capitalize pl-4" title={match.map}>
        <MapIcon map={match.map} />
      </td>
      <td className="text-left min-w-[4%] capitalize pl-4" title={match.result}>
        <ResultIcon result={match.result} />
      </td>
      <td className="text-left min-w-[4%] pl-4">{formatNumber(match.totalToken, 2)}</td>
      
      {/* Masquer les colonnes financières en mode streamer */}
      {!streamerMode && (
        <>
          <td className="text-left min-w-[4%] text-accent pl-4">
            {formatPrice(match.calculated.tokenValue)}
          </td>
        </>
      )}
      
      <td className="text-left min-w-[4%] pl-4">{formatNumber(Math.round(match.totalToken / match.energyUsed))}</td>


      {/* Masquer les colonnes financières en mode streamer */}
      {!streamerMode && (
        <>
          <td className="text-left min-w-[4%] pl-4">{formatPrice(match.calculated.tokenValue / match.energyUsed)}</td>
        </>
      )}

      <td className="text-left min-w-[3%] pl-4">{formatNumber(match.totalPremiumCurrency)}</td>
      
      {/* Masquer les colonnes financières en mode streamer */}
      {!streamerMode && (
        <>
          <td className="text-left min-w-[4%] text-accent pl-4">
            {formatPrice(match.calculated.premiumValue)}
          </td>
          {match.calculated.profit > 0 ? (
            <td className="text-left min-w-[5%] text-accent pl-4">
              {formatPrice(match.calculated.profit)}
            </td>
          ) : (
            <td className="text-left min-w-[5%] text-red-500 pl-4">
              {formatPrice(match.calculated.profit)}
            </td>
          )}
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
          editDisabled={isMatchEditDisabled(match)}
          itemName={`match "${match.build}"`}
        />
      </td>
    </tr>
  );
}

// Fonction pour vérifier si le match peut être édité (moins de 15 minutes après sa création)
function isMatchEditDisabled(match) {
  const creationTime = new Date(match.created_at || match.date);
  const currentTime = new Date();
  const timeDifferenceInMinutes = (currentTime - creationTime) / (1000 * 60);
  
  return timeDifferenceInMinutes > 15;
}
