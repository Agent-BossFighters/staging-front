import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { useBadges } from "@features/dashboard/locker/hook/useBadges";
import { useEffect, useCallback, memo } from "react";

const RaritySelect = memo(
  ({ value, onChange, disabled = false, selectedBadges = [] }) => {
    const { badges, loading, fetchMyBadges } = useBadges();

    useEffect(() => {
      if (!badges.length) {
        fetchMyBadges();
      }
    }, []); // Suppression de la dépendance fetchMyBadges

    const handleValueChange = useCallback(
      (selectedValue) => {
        if (selectedValue === "none") {
          onChange(selectedValue);
          return;
        }

        const badge = badges.find((b) => {
          const badgeRarity =
            typeof b.rarity === "object" ? b.rarity.name : b.rarity;
          const badgeId = String(b.id);
          return (
            `${badgeRarity.toLowerCase()}#${badgeId}` ===
            selectedValue.toLowerCase()
          );
        });

        if (badge) {
          const rarity =
            typeof badge.rarity === "object" ? badge.rarity.name : badge.rarity;
          onChange(`${rarity.toLowerCase()}#${badge.id}`);
        }
      },
      [badges, onChange]
    );

    // Filtrer les badges par ID au lieu de la rareté
    const availableBadges = badges.filter((badge) => {
      return !selectedBadges.some((selectedBadge) => {
        const [, selectedId] = selectedBadge.split("#");
        return selectedId === String(badge.id);
      });
    });

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
                    const [selectedRarity] = value.split("#");
                    return (
                      badgeRarity.toLowerCase() === selectedRarity.toLowerCase()
                    );
                  })?.rarity?.color,
                }}
              >
                {value.split("#")[0].charAt(0).toUpperCase()}
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Select</SelectItem>
          {availableBadges.map((badge) => {
            const rarity =
              typeof badge.rarity === "object"
                ? badge.rarity.name
                : badge.rarity;
            return (
              <SelectItem
                key={`${rarity}-${badge.id}`}
                value={`${rarity.toLowerCase()}#${badge.id}`}
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
  }
);

RaritySelect.displayName = "RaritySelect";
export default RaritySelect;
