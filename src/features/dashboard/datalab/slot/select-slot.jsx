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

  const filteredRarities = data.rarities.filter((item) => {
    if (!limitRarity) return true;
    return (
      item.rarity !== limitRarity &&
      data.rarities.indexOf(item) <=
        data.rarities.indexOf(
          data.rarities.find((r) => r.rarity === limitRarity),
        )
    );
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
        className={`inline-flex items-center gap-1 w-auto min-w-max px-4 py-2 ${rounded ? "rounded-full" : ""}`}
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
