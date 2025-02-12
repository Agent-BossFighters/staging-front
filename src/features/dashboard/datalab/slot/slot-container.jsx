import { useEffect } from "react";
import Slot from "./slot";
import SlotCost from "./slot-cost";
import SelectSlot from "./select-slot";
import { useSlots } from "./hook/useSlots";

export default function SlotContainer() {
  const { slots, loading, fetchSlots } = useSlots();

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div className="flex flex-col px-5 gap-5">
      <Slot slots={slots} loading={loading} />
      <div className="w-3/4 flex justify-start items-start gap-5">
        <SlotCost slots={slots} loading={loading} />
        <div className="">
          <h3 className="text-2xl font-bold whitespace-nowrap">BADGE RARITY</h3>
          <SelectSlot />
        </div>
      </div>
    </div>
  );
}
