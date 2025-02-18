import { useEffect } from "react";
import Badge from "./badges.jsx";
import SelectSlotUsed from "./select-slot-used.jsx";
import BadgesPrices from "./badges-prices.jsx";
import BftMultiplierInput from "./bft-multiplier-input.jsx";
import { useBadges } from "./hook/useBadge";

export default function BadgeContainer() {
  const { 
    badges,
    mainBadges,
    priceBadges,
    loading, 
    fetchBadges, 
    mainSlotsUsed,
    priceSlotsUsed,
    bftMultiplier,
    updateMainTableMetrics,
    updatePriceTableMetrics
  } = useBadges();

  useEffect(() => {
    fetchBadges();
  }, []); // Initial fetch only

  const handleMainSlotChange = async (newValue) => {
    await updateMainTableMetrics(newValue);
  };

  const handlePriceSlotChange = async (newValue) => {
    await updatePriceTableMetrics(newValue, bftMultiplier);
  };

  const handleMultiplierChange = async (newValue) => {
    await updatePriceTableMetrics(priceSlotsUsed, newValue);
  };

  return (
    <div className="flex flex-col px-5 gap-5">
      <div className="flex-grow flex justify-start items-start gap-5">
        <Badge badges={mainBadges} loading={loading} />
        <div className="pt-12">
          <h3 className="text-2xl font-bold whitespace-nowrap">SLOT(S) USED</h3>
          <SelectSlotUsed value={mainSlotsUsed} onChange={handleMainSlotChange} />
        </div>
      </div>
      <div className="flex-grow flex justify-start items-start gap-5">
        <BadgesPrices badges={priceBadges} loading={loading} />
        <div className="flex flex-col gap-5">
          <div className="">
            <h3 className="text-2xl font-bold whitespace-nowrap">
              $BFT BONUS MULTIPLIER
            </h3>
            <BftMultiplierInput 
              value={bftMultiplier} 
              onChange={handleMultiplierChange}
            />
          </div>
          <div className="">
            <h3 className="text-2xl font-bold whitespace-nowrap">
              SLOT(S) USED
            </h3>
            <SelectSlotUsed value={priceSlotsUsed} onChange={handlePriceSlotChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
