import Slot from "./slot";
import SlotCost from "./slot-cost";
import SelectSlot from "./select-slot";

export default function SlotContainer() {
  return (
    <div className="flex flex-col px-5 gap-5">
      <Slot />
      <div className="w-3/4 flex justify-start items-start gap-5">
        <SlotCost />
        <div className="">
          <h3 className="text-2xl font-bold whitespace-nowrap">BADGE RARITY</h3>
          <SelectSlot />
        </div>
      </div>
    </div>
  );
}
