import Slot from "./slot/slot";
import SlotCost from "./slot/slot-cost";
export default function SlotContainer() {
  return (
    <div className="flex flex-col">
      <Slot />
      <SlotCost />
    </div>
  );
}
