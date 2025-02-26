import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { useBadges } from "@features/dashboard/locker/hook/useBadges";
import { useEffect, useCallback, memo } from "react";

const RaritySelect = memo(({ value, onChange, disabled = false }) => {
  const { badges, loading, fetchMyBadges } = useBadges();

  useEffect(() => {
    // Only fetch badges if we don't have them yet
    if (!badges.length) {
      fetchMyBadges();
    }
  }, [fetchMyBadges]); // Add fetchMyBadges as a dependency

  const handleValueChange = useCallback(
    (selectedValue) => {
      if (selectedValue === "none") {
        onChange(selectedValue);
        return;
      }

      const badge = badges.find((b) => {
        const badgeRarity =
          typeof b.rarity === "object" ? b.rarity.name : b.rarity;
        return badgeRarity.toLowerCase() === selectedValue.toLowerCase();
      });

      if (badge) {
        const rarity =
          typeof badge.rarity === "object" ? badge.rarity.name : badge.rarity;
        onChange(rarity.toLowerCase());
      }
    },
    [badges, onChange]
  );

  if (loading && !badges.length) return null;

  return (
    <Select
      value={value || "none"}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-16 h-8 px-2">
        <SelectValue>
          {value === "none" ? (
            <span>Select</span>
          ) : (
            <span
              className="border-2 rounded-full px-2 py-1"
              style={{
                borderColor: badges.find((badge) => {
                  const badgeRarity =
                    typeof badge.rarity === "object"
                      ? badge.rarity.name
                      : badge.rarity;
                  return badgeRarity.toLowerCase() === value.toLowerCase();
                })?.rarity?.color,
              }}
            >
              {value.charAt(0).toUpperCase()}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Select</SelectItem>
        {badges.map((badge) => {
          const rarity =
            typeof badge.rarity === "object" ? badge.rarity.name : badge.rarity;
          return (
            <SelectItem
              key={`${rarity}-${badge.id}`}
              value={rarity.toLowerCase()}
            >
              <div className="flex items-center gap-2">
                <span
                  className="border-2 rounded-full px-2 py-1"
                  style={{ borderColor: badge.rarity.color }}
                >
                  {rarity}
                </span>
                <span>{badge.name}</span>
                <span className="text-muted-foreground">#{badge.id}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
});

RaritySelect.displayName = "RaritySelect";
export default RaritySelect;
