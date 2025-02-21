import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { rarities } from "@shared/data/rarities.json";

export default function RaritySelect({ value, onChange, disabled = false }) {
  return (
    <Select
      value={value || "rare"}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-12 h-8 px-2">
        <SelectValue>
          {value ? (
            <span
              style={{
                color: rarities.find(
                  (r) => r.rarity.toLowerCase() === value.toLowerCase()
                )?.color,
              }}
            >
              {value.charAt(0).toUpperCase()}
            </span>
          ) : (
            <span
              style={{
                color: rarities.find((r) => r.rarity.toLowerCase() === "rare")
                  ?.color,
              }}
            >
              R
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {rarities
          .sort((a, b) => a.order - b.order)
          .map((rarity) => (
            <SelectItem key={rarity.rarity} value={rarity.rarity.toLowerCase()}>
              <span style={{ color: rarity.color }}>
                {rarity.rarity.charAt(0).toUpperCase()}
              </span>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
