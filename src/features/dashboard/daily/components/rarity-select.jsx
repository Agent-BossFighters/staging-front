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
    }, []);

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

    // Filtrer les badges déjà sélectionnés
    const availableBadges = badges.filter((badge) => {
      // Si c'est le badge actuellement sélectionné dans ce slot, on le garde
      if (value && value !== "none") {
        const [currentRarity, currentId] = value.split("#");
        if (
          String(badge.id) === currentId &&
          (typeof badge.rarity === "object"
            ? badge.rarity.name
            : badge.rarity
          ).toLowerCase() === currentRarity.toLowerCase()
        ) {
          return true;
        }
      }

      // Vérifier si le badge est déjà utilisé dans un autre slot
      return !selectedBadges.some((selectedBadge) => {
        if (selectedBadge === "none") return false;
        const [, selectedId] = selectedBadge.split("#");
        return selectedId === String(badge.id);
      });
    });

    // Trier les badges par rareté
    const sortedBadges = [...availableBadges].sort((a, b) => {
      const rarityA = typeof a.rarity === "object" ? a.rarity.name : a.rarity;
      const rarityB = typeof b.rarity === "object" ? b.rarity.name : b.rarity;
      return rarityA.localeCompare(rarityB);
    });

    if (loading && !badges.length) return null;

    return (
      <Select
        value={value || "none"}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-14 h-8 px-2 rounded-full bg-[#212121] ">
          <SelectValue>
            {value === "none" ? (
              <span></span>
            ) : (
              <span
                className="border-2 rounded-full px-1.5"
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {value.split("#")[0].charAt(0).toUpperCase()}
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Select</SelectItem>
          {sortedBadges.map((badge) => {
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
