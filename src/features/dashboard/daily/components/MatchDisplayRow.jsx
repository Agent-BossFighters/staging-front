import RarityBadge from "./RarityBadge";
import MapIcon from "./MapIcon";
import ResultIcon from "./ResultIcon";
import ActionButtons from "./ActionButtons";
import { useUserPreference } from "@context/userPreference.context";

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
            <span>{`${currentBuild.bftBonus}%`}</span>
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
      <td className="px-4 text-left min-w-[4%]">{match.luckrate}</td>
      <td className="px-4 text-left min-w-[4%]">{match.time}</td>
      <td className="px-4 text-left min-w-[4%]">{match.energyUsed}</td>
      
      {/* Masquer les colonnes financières en mode streamer */}
      {!streamerMode && (
        <>
          <td className="px-4 text-left min-w-[4%] text-destructive">
            ${match.calculated.energyCost}
          </td>
        </>
      )}
      
      <td className="px-6 text-left min-w-[4%] capitalize" title={match.map}>
        <MapIcon map={match.map} />
      </td>
      <td className="px-6 text-left min-w-[4%] capitalize" title={match.result}>
        <ResultIcon result={match.result} />
      </td>
      <td className="px-4 text-left min-w-[4%]">{match.totalToken}</td>
      
      {/* Masquer les colonnes financières en mode streamer */}
      {!streamerMode && (
        <>
          <td className="px-4 text-left min-w-[4%] text-accent">
            ${match.calculated.tokenValue}
          </td>
        </>
      )}
      
      <td className="px-4 text-left min-w-[4%]">{Math.round(match.totalToken / match.time)}</td>


      {/* Masquer les colonnes financières en mode streamer */}
      {!streamerMode && (
        <>
          <td className="px-4 text-left min-w-[4%]">${(match.calculated.tokenValue / match.time).toFixed(2)}</td>
        </>
      )}

      <td className="px-4 text-left min-w-[3%]">{match.totalPremiumCurrency}</td>
      
      {/* Masquer les colonnes financières en mode streamer */}
      {!streamerMode && (
        <>
          <td className="px-4 text-left min-w-[4%] text-accent">
            ${match.calculated.premiumValue}
          </td>
          <td className="px-4 text-left min-w-[5%] text-accent">
            ${match.calculated.profit}
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
        />
      </td>
    </tr>
  );
}
