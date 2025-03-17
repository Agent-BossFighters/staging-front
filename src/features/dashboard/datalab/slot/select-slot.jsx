import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import data from "@shared/data/rarities.json";

export default function SelectSlot({
  onSelectRarity,
  limitRarity,
  rounded,
  selectedRarity,
  disabled,
}) {
  const [internalSelectedRarity, setInternalSelectedRarity] =
    useState(selectedRarity);
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const rarityOrderMap = Object.fromEntries(
    data.rarities.map(({ rarity, order }) => [rarity, order])
  );

  const filteredRarities = data.rarities.filter((item) => {
    if (!limitRarity) return true;
    return rarityOrderMap[item.rarity] <= rarityOrderMap[limitRarity];
  });

  useEffect(() => {
    setInternalSelectedRarity(selectedRarity);
  }, [selectedRarity]);

  useEffect(() => {
    if (internalSelectedRarity && internalSelectedRarity !== "none") {
      const rarity = data.rarities.find(
        (item) => item.rarity === internalSelectedRarity
      );
      setSelectedColor(rarity ? rarity.color : "#FFFFFF");
    } else {
      setSelectedColor("#FFFFFF");
    }
  }, [internalSelectedRarity]);

  const handleValueChange = (value) => {
    if (disabled) return;
    setInternalSelectedRarity(value);

    if (onSelectRarity) {
      onSelectRarity(value);
    }
  };

  return (
    <Select
      onValueChange={handleValueChange}
      value={internalSelectedRarity || "none"}
      disabled={disabled}
    >
      <SelectTrigger
        className={`inline-flex items-center gap-1 w-[150px] px-4 py-2 ${rounded ? "rounded-full" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        style={{ color: selectedColor }}
      >
        <SelectValue placeholder="Select">
          {internalSelectedRarity && internalSelectedRarity !== "none"
            ? internalSelectedRarity
            : "Select"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Badge Rarity</SelectLabel>
          {filteredRarities.map((item) => (
            <SelectItem
              key={item.rarity}
              value={item.rarity}
              style={{ color: item.color }}
            >
              {item.rarity}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
