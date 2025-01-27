import Slot from "./slot";
import SlotCost from "./slot-cost";
export default function SlotContainer() {
  return (
    <div className="flex flex-col px-5">
      <Slot />
      <SlotCost />
    </div>
  );
}
