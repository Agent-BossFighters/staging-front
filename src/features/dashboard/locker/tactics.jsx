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
import SelectSlot from "@features/dashboard/datalab/slot/select-slot";
import { Contract } from "@img/index";
import { useUserPreference } from "@context/userPreference.context";
import { useCurrencyPacks } from "./hook/useCurrencyPacks";

const numbers = Array.from({ length: 4 }, (_, i) => i + 1);

export default function Tactics() {
  const { setMaxRarity, unlockedSlots, setUnlockedSlots } = useUserPreference();
  const { currencyPacks, loading, error, fetchCurrencyPacks } =
    useCurrencyPacks();
  const [selectedValue1, setSelectedValue1] = useState(numbers[0].toString());
  const [selectedPack, setSelectedPack] = useState(null);

  // Convertir le nombre total de slots en nombre de slots additionnels pour l'affichage
  const displayedSlots = (unlockedSlots - 1).toString();
  
  const handleSlotChange = (value) => {
    // Convertir le nombre de slots additionnels en nombre total de slots
    setUnlockedSlots(parseInt(value) + 1);
  };

  useEffect(() => {
    fetchCurrencyPacks();
  }, []);

  const formatSelectedValue = (value) => {
    if (!value) return "Select";
    const pack = currencyPacks.find(
      (p) => p.currencyNumber.toString() === value
    );
    if (!pack) return "Select";
    return `$${pack.price} (${pack.currencyNumber.toLocaleString()})`;
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

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
            FAVORITE FLEX PACK
          </h3>
          <Select value={selectedPack} onValueChange={setSelectedPack}>
            <SelectTrigger className="inline-flex items-center gap-1 w-[200px] px-4 py-2">
              <SelectValue>{formatSelectedValue(selectedPack)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {currencyPacks.map((pack) => (
                  <SelectItem
                    key={pack.id}
                    value={pack.currencyNumber.toString()}
                    className="py-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        ${pack.price} ({pack.currencyNumber.toLocaleString()})
                      </span>
                      <span className="text-sm text-gray-400">
                        ${pack.unitPrice}/FLEX
                      </span>
                    </div>
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
          <Select value={displayedSlots} onValueChange={handleSlotChange}>
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
