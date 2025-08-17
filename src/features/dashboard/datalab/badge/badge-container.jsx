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
    <div className="flex flex-col gap-5">
      {/* Premier tableau avec son filtre */}
      <div className="w-full flex flex-col lg:flex-row justify-start items-start gap-5">
        <div className="w-full order-2 lg:order-1">
          <Badge badges={badges} loading={loading} />
        </div>
        <div className="w-full lg:order-2 lg:mt-10">
          <h3 className="text-1rem font-bold whitespace-nowrap">SLOT(S) USED</h3>
          <FreemiumControl defaultValue="1">
            <SelectSlotUsed
              defaultValue={mainSlotsUsed.toString()}
              onValueChange={updateMainTableMetrics}
            />
          </FreemiumControl>
        </div>
      </div>
      
      {/* Deuxième tableau avec ses filtres */}
      <div className="w-full flex flex-col lg:flex-row justify-start items-start gap-5">
        <div className="order-2 lg:order-1">
          <BadgesPrices badges={priceBadges} loading={loading} />
        </div>
        <div className="w-full lg:w-1/5 order-1 lg:order-2 flex flex-row lg:flex-col gap-5 lg:items-start items-center">
          <div className="lg:w-full">
            <h3 className="text-1rem font-bold whitespace-nowrap leading-tight">
              $BFT BONUS<br></br>MULTIPLIER
            </h3>
            <FreemiumControl defaultValue={1.0}>
              <SelectMultiplier
                value={bftMultiplier}
                onChange={handleBftMultiplierChange}
              />
            </FreemiumControl>
          </div>
          <div className="lg:w-full">
            <h3 className="text-1rem font-bold whitespace-nowrap">
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
