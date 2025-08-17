import { useEffect } from "react";
import Slot from "./slot";
import SlotCost from "./slot-cost";
import SelectSlot from "./select-slot";
import { useSlots } from "./hook/useSlots";
import FreemiumControl from "../FreemiumControl";

export default function SlotContainer() {
  const { slots, loading, fetchSlots, selectedRarity, handleRarityChange } =
    useSlots();

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <Slot slots={slots} loading={loading} />
      <div className="w-full flex flex-col lg:flex-row justify-start items-start gap-5">
        <div className="w-full lg:w-1/5 order-1 lg:order-2">
          <h3 className="text-1rem font-bold whitespace-nowrap">BADGE RARITY</h3>
          <FreemiumControl defaultValue="Common">
            <SelectSlot
              onSelectRarity={handleRarityChange}
              selectedRarity={selectedRarity}
            />
          </FreemiumControl>
        </div>
        <div className="w-full lg:w-4/5 order-2 lg:order-1">
          <SlotCost
            slots={slots}
            loading={loading}
            selectedRarity={selectedRarity}
          />
        </div>
      </div>
    </div>
  );
}
