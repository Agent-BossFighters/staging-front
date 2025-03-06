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
}) {
  return (
    <tr>
      <td className="min-w-[120px] pl-4">
        <Select
          value={data.buildId}
          onValueChange={(value) => onChange("buildId", value)}
        >
          <SelectTrigger className="w-full h-8">
            <SelectValue placeholder="Select" />
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
      {Array(MAX_SLOTS)
        .fill(null)
        .map((_, index) => (
          <td key={index} className="min-w-[60px] pl-4 first:pl-4">
            {!isEditing && index >= unlockedSlots ? (
              <RarityBadge rarity="none" />
            ) : (
              <RaritySelect
                value={data.rarities[index]}
                onChange={(value) => onRarityChange(index, value)}
                disabled={!isEditing && index >= unlockedSlots}
                selectedBadges={data.rarities
                  .filter((r, i) => i !== index && r !== "none")
                  .map((r) => {
                    const [rarity, id] = r.split("#");
                    return id ? `${rarity}#${id}` : r;
                  })}
              />
            )}
          </td>
        ))}
      <td className="text-center min-w-[80px]">-</td>
      <td className="min-w-[80px]">
        <Input
          type="number"
          className="w-20 text-center pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
          value={data.time}
          onChange={(e) => onChange("time", e.target.value)}
        />
      </td>
      <td className="text-center min-w-[80px]">-</td>
      <td className="text-center min-w-[80px] text-destructive">-</td>
      <td className="min-w-[100px]">
        <Select
          value={data.map}
          onValueChange={(value) => onChange("map", value)}
        >
          <SelectTrigger className="w-20 h-8 px-2">
            <SelectValue placeholder="Select">
              {data.map ? (
                <div className="flex items-center gap-1">
                  <MapIcon map={data.map} />
                  <span>{GAME_MAPS[data.map]?.label.slice(0, 3)}</span>
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
      <td className="min-w-[80px]">
        <Select
          value={data.result}
          onValueChange={(value) => onChange("result", value)}
        >
          <SelectTrigger className="w-20 h-8 px-2">
            <SelectValue placeholder="Select" />
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
      <td className="min-w-[80px]">
        <Input
          type="number"
          className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
          value={data.bft}
          onChange={(e) => onChange("bft", e.target.value)}
        />
      </td>
      <td className="text-center min-w-[80px] text-accent">-</td>
      <td className="min-w-[80px]">
        <Input
          type="number"
          className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
          value={data.flex}
          onChange={(e) => onChange("flex", e.target.value)}
        />
      </td>
      <td className="text-center min-w-[80px] text-accent">-</td>
      <td className="text-center min-w-[80px] text-green-500">-</td>
      <td className="text-center min-w-[80px]">
        {data.buildId ? (
          <div className="flex flex-col">
            <span>{`${builds.find((b) => b.id === data.buildId)?.bftBonus || 0}%`}</span>
          </div>
        ) : (
          "-"
        )}
      </td>
      <td className="flex gap-2 items-center justify-center min-w-[100px]">
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
