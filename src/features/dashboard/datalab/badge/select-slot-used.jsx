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

const numbers = Array.from({ length: 4 }, (_, i) => i + 1);

export default function SelectSlotUsed() {
  const [selectedValue, setSelectedValue] = useState(numbers[0].toString());

  return (
    <Select value={selectedValue} onValueChange={setSelectedValue}>
      <SelectTrigger className="inline-flex items-center gap-1 w-auto min-w-max px-4 py-2">
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
