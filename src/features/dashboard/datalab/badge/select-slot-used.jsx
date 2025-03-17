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

const numbers = Array.from({ length: 5 }, (_, i) => i + 1);

export default function SelectSlotUsed({
  onValueChange,
  defaultValue = "1",
  disabled,
}) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleValueChange = (value) => {
    if (disabled) return;
    setSelectedValue(value);
    if (onValueChange) {
      onValueChange(parseInt(value));
    }
  };

  return (
    <Select
      value={selectedValue}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger
        className={`inline-flex items-center gap-1 w-auto min-w-max px-4 py-2 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <SelectValue placeholder="Select a number of slot" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Slot Used</SelectLabel>
          {numbers.map((number) => (
            <SelectItem key={number} value={number.toString()}>
              {number}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
