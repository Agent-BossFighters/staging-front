import { useState } from "react";
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
}) {
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const rarityOrderMap = Object.fromEntries(
    data.rarities.map(({ rarity, order }) => [rarity, order])
  );

  const filteredRarities = data.rarities.filter((item) => {
    if (!limitRarity) return true;
    return rarityOrderMap[item.rarity] <= rarityOrderMap[limitRarity];
  });

  const handleValueChange = (value) => {
    const rarity = data.rarities.find((item) => item.rarity === value);
    setSelectedColor(rarity ? rarity.color : "#FFFFFF");

    if (onSelectRarity) {
      onSelectRarity(value);
    }
  };

  return (
    <Select onValueChange={handleValueChange} defaultValue={selectedRarity}>
      <SelectTrigger
        className={`inline-flex items-center gap-1 w-[120px] px-4 py-2 ${rounded ? "rounded-full" : ""}`}
        style={{ color: selectedColor }}
      >
        <SelectValue placeholder="Select" />
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
