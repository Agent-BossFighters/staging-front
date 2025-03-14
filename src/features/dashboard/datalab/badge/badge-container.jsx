import { useEffect } from "react";
import Badge from "./badges.jsx";
import SelectSlotUsed from "./select-slot-used.jsx";
import SelectMultiplier from "./select-multiplier.jsx";
import BadgesPrices from "./badges-prices.jsx";
import { useBadges } from "./hook/useBadge";
import FreemiumControl from "../FreemiumControl";

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

  const handleBftMultiplierChange = (value) => {
    updatePriceTableMetrics(priceSlotsUsed, value);
  };

  return (
    <div className="flex flex-col px-5 gap-5">
      <div className="flex-grow flex justify-start items-start gap-5">
        <Badge badges={badges} loading={loading} />
        <div className="pt-12">
          <h3 className="text-2xl font-bold whitespace-nowrap">SLOT(S) USED</h3>
          <FreemiumControl defaultValue="1">
            <SelectSlotUsed
              defaultValue={mainSlotsUsed.toString()}
              onValueChange={updateMainTableMetrics}
            />
          </FreemiumControl>
        </div>
      </div>
      <div className="flex-grow flex justify-start items-start gap-5">
        <BadgesPrices badges={priceBadges} loading={loading} />
        <div className="flex flex-col gap-5">
          <div className="">
            <h3 className="text-2xl font-bold whitespace-nowrap">
              $BFT BONUS MULTIPLIER
            </h3>
            <FreemiumControl defaultValue={1.0}>
              <SelectMultiplier
                value={bftMultiplier}
                onChange={handleBftMultiplierChange}
              />
            </FreemiumControl>
          </div>
          <div className="">
            <h3 className="text-2xl font-bold whitespace-nowrap">
              SLOT(S) USED
            </h3>
            <FreemiumControl defaultValue="1">
              <SelectSlotUsed
                defaultValue={priceSlotsUsed.toString()}
                onValueChange={(value) =>
                  updatePriceTableMetrics(value, bftMultiplier)
                }
              />
            </FreemiumControl>
          </div>
        </div>
      </div>
    </div>
  );
}
