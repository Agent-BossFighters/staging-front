import Badge from "./badges.jsx";
import SelectSlotUsed from "./select-slot-used.jsx";
import BadgesPrices from "./badges-prices.jsx";
import { Input } from "@ui/input";
export default function BadgeContainer() {
  return (
    <div className="flex flex-col px-5 gap-5">
      <div className="flex-grow flex justify-start items-start gap-5">
        <Badge />
        <div className="pt-12">
          <h3 className="text-2xl font-bold whitespace-nowrap">SLOT(S) USED</h3>
          <SelectSlotUsed />
        </div>
      </div>
      <div className="flex-grow flex justify-start items-start gap-5">
        <BadgesPrices />
        <div className="flex flex-col gap-5">
          <div className="">
            <h3 className="text-2xl font-bold whitespace-nowrap">
              $BFT BONUS MULTIPLIER
            </h3>
            <Input
              type="text"
              name="bonus"
              placeholder="1.0"
              className="w-1/4 font-bold"
            />
          </div>
          <div className="">
            <h3 className="text-2xl font-bold whitespace-nowrap">
              SLOT(S) USED
            </h3>
            <SelectSlotUsed />
          </div>
        </div>
      </div>
    </div>
  );
}
