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

export default function SelectSlot() {
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  return (
    <Select
      onValueChange={(value) => {
        const rarity = data.rarities.find((item) => item.rarity === value);
        setSelectedColor(rarity ? rarity.color : "#FFFFFF");
      }}
    >
      <SelectTrigger
        className="inline-flex items-center gap-1 w-auto min-w-max px-4 py-2"
        style={{ color: selectedColor }}
      >
        <SelectValue placeholder="Select a badge rarity" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Badge Rarity</SelectLabel>
          {data.rarities.map((item) => (
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
