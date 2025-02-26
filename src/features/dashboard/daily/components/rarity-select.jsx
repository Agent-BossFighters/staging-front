import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { useBadges } from "@features/dashboard/locker/hook/useBadges";
import { useEffect } from "react";

export default function RaritySelect({ value, onChange, disabled = false }) {
  const { badges, loading, fetchMyBadges } = useBadges();

  useEffect(() => {
    fetchMyBadges();
  }, []);

  if (loading) return null;

  const handleValueChange = (selectedValue) => {
    if (selectedValue === "none") {
      onChange(selectedValue);
      return;
    }

    const badge = badges.find(
      (b) => b.rarity.name.toLowerCase() === selectedValue.toLowerCase()
    );
    onChange(badge.rarity.name.toLowerCase());
  };

  return (
    <Select
      value={value || "none"}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-12 h-8 px-2">
        <SelectValue>
          {value === "none" ? (
            <span>Select</span>
          ) : (
            <span
              className="border-2 rounded-full px-2 py-1"
              style={{
                borderColor: badges.find(
                  (badge) =>
                    badge.rarity.name.toLowerCase() === value.toLowerCase()
                )?.rarity.color,
              }}
            >
              {value.charAt(0).toUpperCase()}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Select</SelectItem>
        {badges.map((badge) => (
          <SelectItem
            key={`${badge.rarity.name}-${badge.issueId}`}
            value={badge.rarity.name.toLowerCase()}
          >
            <div className="flex items-center gap-2">
              <span
                className="border-2 rounded-full px-2 py-1"
                style={{ borderColor: badge.rarity.color }}
              >
                {badge.rarity.name}
              </span>
              <span>{badge.name}</span>
              <span className="text-muted-foreground">#{badge.issueId}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
