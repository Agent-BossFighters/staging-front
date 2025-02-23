import { useEffect } from "react";
import Badge from "./badges.jsx";
import SelectSlotUsed from "./select-slot-used.jsx";
import BadgesPrices from "./badges-prices.jsx";
import { Input } from "@ui/input";
import { useBadges } from "./hook/useBadge";

export default function BadgeContainer() {
  const {
    badges,
    loading,
    fetchBadges,
    mainSlotsUsed,
    priceSlotsUsed,
    bftMultiplier,
    updateMainTableMetrics,
    updatePriceTableMetrics,
    priceBadges,
  } = useBadges();

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleBftMultiplierChange = (e) => {
    const value = parseFloat(e.target.value) || 1.0;
    updatePriceTableMetrics(priceSlotsUsed, value);
  };

  return (
    <div className="flex flex-col px-5 gap-5">
      <div className="flex-grow flex justify-start items-start gap-5">
        <Badge badges={badges} loading={loading} />
        <div className="pt-12">
          <h3 className="text-2xl font-bold whitespace-nowrap">SLOT(S) USED</h3>
          <SelectSlotUsed
            defaultValue={mainSlotsUsed.toString()}
            onValueChange={updateMainTableMetrics}
          />
        </div>
      </div>
      <div className="flex-grow flex justify-start items-start gap-5">
        <BadgesPrices badges={priceBadges} loading={loading} />
        <div className="flex flex-col gap-5">
          <div className="">
            <h3 className="text-2xl font-bold whitespace-nowrap">
              $BFT BONUS MULTIPLIER
            </h3>
            <Input
              type="text"
              name="bonus"
              placeholder="1.0"
              defaultValue={bftMultiplier}
              onChange={handleBftMultiplierChange}
              className="w-1/4 font-bold"
            />
          </div>
          <div className="">
            <h3 className="text-2xl font-bold whitespace-nowrap">
              SLOT(S) USED
            </h3>
            <SelectSlotUsed
              defaultValue={priceSlotsUsed.toString()}
              onValueChange={(value) =>
                updatePriceTableMetrics(value, bftMultiplier)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
