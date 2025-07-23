import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { useBadges } from "@features/dashboard/locker/hook/useBadges";
import { useEffect, useCallback, memo } from "react";
import rarities from "@shared/data/rarities.json";
import { formatId } from "@utils/formatters";

const RaritySelect = memo(
  ({
    value,
    onChange,
    disabled = false,
    selectedBadges = [],
    showIssueId = false, // nouvelle prop
  }) => {
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

    const availableBadges = badges.filter((badge) => {
      const badgeId = String(badge.id);
      
      for (const selectedBadge of selectedBadges) {
        if (selectedBadge === "none") continue;
        
        const [, selectedId] = selectedBadge.split("#");
        
        if (selectedId === badgeId) {
          return false;
        }
      }
      
      if (value && value !== "none") {
        const [, currentId] = value.split("#");
        if (currentId === badgeId) {
          return true;
        }
      }
      
      return true;
    });

    // Trier les badges par rareté
    const sortedBadges = [...availableBadges].sort((a, b) => {
      const rarityA = typeof a.rarity === "object" ? a.rarity.name : a.rarity;
      const rarityB = typeof b.rarity === "object" ? b.rarity.name : b.rarity;
      
      // Utiliser l'ordre défini dans le fichier rarities.json
      const getRarityOrder = (rarityName) => {
        const rarityObj = rarities.rarities.find(
          r => r.rarity.toLowerCase() === rarityName.toLowerCase()
        );
        return rarityObj ? rarityObj.order : Number.MAX_SAFE_INTEGER;
      };
      
      const orderA = getRarityOrder(rarityA);
      const orderB = getRarityOrder(rarityB);
      
      // Comparer les ordres (ou utiliser l'ordre alphabétique si la rareté n'est pas listée)
      return orderA === orderB ? rarityA.localeCompare(rarityB) : orderA - orderB;
    });

    // Trouver le badge sélectionné
    const selectedBadge =
      value && value !== "none"
        ? badges.find((badge) => {
            const badgeRarity =
              typeof badge.rarity === "object" ? badge.rarity.name : badge.rarity;
            const badgeId = String(badge.id);
            const [selectedRarity, selectedId] = value.split("#");
            return (
              badgeRarity.toLowerCase() === selectedRarity.toLowerCase() &&
              badgeId === selectedId
            );
          })
        : null;

    if (loading && !badges.length) return null;

    return (
      <div className="flex justify-between items-center min-w-[150px]">
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
                    <span className="text-muted-foreground">{formatId(badge.issueId)}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {/* Affichage à droite du select */}
        {showIssueId && selectedBadge && (
          <span className="mr-2 text-sm text-gray-100">
            {formatId(selectedBadge.issueId)}
          </span>
        )}
      </div>
    );
  }
);

RaritySelect.displayName = "RaritySelect";
export default RaritySelect;
