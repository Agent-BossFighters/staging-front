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
import SelectSlot from "@features/dashboard/datalab/slot/select-slot";
import { Contract } from "@img/index";
import { useUserPreference } from "@context/userPreference.context";

const numbers = Array.from({ length: 4 }, (_, i) => i + 1);

export default function Tatics() {
  const { setMaxRarity } = useUserPreference();
  const [selectedValue, setSelectedValue] = useState(numbers[0].toString());
  const [selectedValue1, setSelectedValue1] = useState(numbers[0].toString());

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-3xl font-extrabold py-2 flex gap-3 items-center">
        <img src={Contract} alt="contract" className="w-10 h-10" />
        MY TACTICS
      </h2>
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-9">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold whitespace-nowrap">
            MAX ITEM RARITY TO SHOW
          </h3>
          <SelectSlot onSelectRarity={(value) => setMaxRarity(value)} />
        </div>
        <div className="flex flex-col">
          <h3 className="text-xl font-bold whitespace-nowrap">
            MY FAVORITE FLEX PACK
          </h3>
          <Select value={selectedValue1} onValueChange={setSelectedValue1}>
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
        </div>
        <div className="flex flex-col">
          <h3 className="text-xl font-bold whitespace-nowrap">
            BADGE SLOT(S) UNLOCKED
          </h3>
          <Select value={selectedValue} onValueChange={setSelectedValue}>
            <SelectTrigger className="inline-flex items-center gap-1 lg:w-1/4 px-4 py-2">
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
        </div>
      </div>
    </div>
  );
}
