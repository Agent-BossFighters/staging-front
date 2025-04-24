import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Input } from "@ui/input";
import RaritySelect from "./rarity-select";
import RarityBadge from "./RarityBadge";
import MapIcon, { GAME_MAPS, MapSelectItem } from "./MapIcon";
import ResultIcon, { GAME_RESULTS, ResultSelectItem } from "./ResultIcon";
import ActionButtons from "./ActionButtons";
import { useUserPreference } from "@context/userPreference.context";
import DateSelector from "./DateSelector";

const MAX_SLOTS = 5;

export default function MatchFormRow({
  data,
  builds,
  isEditing,
  isCreating,
  unlockedSlots,
  onSubmit,
  onCancel,
  onChange,
  onRarityChange,
  selectedDate,
  initialMatchData
}) {
  const { streamerMode } = useUserPreference();
  
  // Utiliser les données initiales si on crée un nouveau match
  const currentData = isCreating ? { ...initialMatchData, ...data } : data;
  
  // Vérifier si la date sélectionnée est aujourd'hui
  const today = new Date();
  const isToday = selectedDate ? 
    selectedDate.getFullYear() === today.getFullYear() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getDate() === today.getDate()
    : false;

  // Si ce n'est pas aujourd'hui, on ne rend rien
  if (!isToday) {
    return null;
  }

  // Si c'est aujourd'hui, on rend le formulaire
  return (
    <tr>
      <td className="min-w-[6%] pl-4">
        <Select
          value={currentData.buildId}
          onValueChange={(value) => onChange("buildId", value)}
        >
          <SelectTrigger className="w-full h-8 rounded-full bg-[#212121] " title={builds.find((b) => b.id === currentData.buildId)?.buildName}>
            <SelectValue placeholder='Select' >
             {builds.find((b) => b.id === currentData.buildId)?.buildName.length < 10 ? builds.find((b) => b.id === currentData.buildId)?.buildName : builds.find((b) => b.id === currentData.buildId)?.buildName.slice(0, 10)+ '...' || 'Select'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {builds.map((build) => (
              <SelectItem key={build.id} value={build.id}>
                {build.buildName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="px-4 text-left min-w-[4%]">
        {currentData.buildId ? (
          <div className="flex flex-col">
            <span>{`${builds.find((b) => b.id === currentData.buildId)?.bftBonus || 0}%`}</span>
          </div>
        ) : (
          "-"
        )}
      </td>
      {Array(MAX_SLOTS)
        .fill(null)
        .map((_, index) => (
          <td key={index} className="px-6 min-w-[4%] pl-4 first:pl-4" title={currentData.rarities[index]?.split("#")[0] || ''}>
            {!isEditing && index >= unlockedSlots ? (
              <RarityBadge rarity="none"/>
            ) : (
              <RaritySelect
                value={currentData.rarities[index]}
                onChange={(value) => onRarityChange(index, value)}
                disabled={!isEditing && index >= unlockedSlots}
                selectedBadges={currentData.rarities
                  .filter((r, i) => i !== index && r !== "none")
                  .map((r) => {
                    const [rarity, id] = r.split("#");
                    return id ? `${rarity}#${id}` : r;
                  })}
              />
            )}
          </td>
        ))}
      <td className="px-4 text-left min-w-[4%]">-</td>
      <td className="min-w-[4%]">
        <Input
          type="number"
          className="w-20 text-left px-4 [appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
          value={currentData.time}
          onChange={(e) => onChange("time", e.target.value)}
        />
      </td>
      <td className="px-4 text-left min-w-[4%]">-</td>
      
      {/* Masquer les colonnes financières en mode streamer */}
      {!streamerMode && (
        <td className="px-4 text-left min-w-[4%] text-destructive">-</td>
      )}
      
      <td className="min-w-[4%]" title={currentData.map}>
        <Select
          value={currentData.map}
          onValueChange={(value) => onChange("map", value)}
        >
          <SelectTrigger className="ml-3 w-14 h-8 px-2 rounded-full bg-[#212121] ">
            <SelectValue placeholder="">
              {currentData.map ? (
                <div className="flex items-center gap-1">
                  <MapIcon map={currentData.map} />
                  <span>{GAME_MAPS[currentData.map]?.slice}</span>
                </div>
              ) : (
                "Select"
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(GAME_MAPS).map(([map, mapData]) => (
              <SelectItem key={map} value={map}>
                <MapSelectItem map={map} mapData={mapData} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="min-w-[4%]" title={currentData.result}>
        <Select
          value={currentData.result}
          onValueChange={(value) => onChange("result", value)}
        >
          <SelectTrigger className="ml-3 w-14 h-8 px-2 rounded-full bg-[#212121] ">
            <SelectValue placeholder="">
              {currentData.result ? (
                <div className="flex items-center gap-1">
                  <ResultIcon result={currentData.result} />
                  <span>{GAME_RESULTS[currentData.result]?.slice}</span>
                </div>
              ) : (
                "Select"
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(GAME_RESULTS).map(([result, resultData]) => (
              <SelectItem key={result} value={result}>
                <ResultSelectItem result={result} resultData={resultData} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="min-w-[4%]">
        <Input
          type="number"
          className="w-20 text-left px-4 [appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
          value={currentData.bft}
          onChange={(e) => onChange("bft", e.target.value)}
        />
      </td>
      
      {/* Masquer les colonnes financières en mode streamer */}
      {!streamerMode && (
        <td className="px-4 text-left min-w-[4%] text-accent">-</td>
      )}
      
      <td className="px-4 text-left min-w-[4%]">-</td>

      {/* Masquer les colonnes financières en mode streamer */}
      {!streamerMode && (
        <td className="px-4 text-left min-w-[3%]">-</td>
      )}
      
      <td className="min-w-[4%]">
        <Input
          type="number"
          className="w-20 text-left px-4 [appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
          value={currentData.flex || "0"}
          onChange={(e) => onChange("flex", e.target.value)}
        />
      </td>
      
      {/* Masquer les colonnes financières en mode streamer */}
      {!streamerMode && (
        <>
          <td className="px-4 text-left min-w-[4%] text-accent">-</td>
          <td className="px-4 text-left min-w-[5%] text-accent">-</td>
        </>
      )}
      
      <td className="flex gap-2 items-left justify-left min-w-[6%]">
        <ActionButtons
          isEditing={isEditing}
          isCreating={isCreating}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </td>
    </tr>
  );
}
