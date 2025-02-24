import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { useRarityManagement } from "../hooks/useRarityManagement";

export default function RaritySelect({ value, onChange, disabled = false }) {
  const {
    getRarityColor,
    getRarityDisplay,
    formatRarityName,
    sortRarities,
    rarities,
  } = useRarityManagement();

  return (
    <Select
      value={value || "rare"}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-12 h-8 px-2">
        <SelectValue>
          <span style={{ color: getRarityColor(value) }}>
            {getRarityDisplay(value)}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {sortRarities(rarities.map((r) => r.rarity)).map((rarity) => (
          <SelectItem key={rarity} value={formatRarityName(rarity)}>
            <span style={{ color: getRarityColor(rarity) }}>
              {getRarityDisplay(rarity)}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
