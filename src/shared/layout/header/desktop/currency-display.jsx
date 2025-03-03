import { Flex, Token3, Token4 } from "@img/index";
import { useGameConstants } from "@context/gameConstants.context";
import { useUserPreference } from "@context/userPreference.context";
import { useCurrencyPacks } from "@features/dashboard/locker/hook/useCurrencyPacks";
import { useEffect } from "react";

export default function CurrencyDisplay() {
  const { CURRENCY_RATES } = useGameConstants();
  const { selectedFlexPack } = useUserPreference();
  const { currencyPacks, fetchCurrencyPacks } = useCurrencyPacks();

  useEffect(() => {
    fetchCurrencyPacks();
  }, []);

  // Calculer le prix unitaire du Flex
  const flexPrice =
    selectedFlexPack && currencyPacks.length > 0
      ? currencyPacks.find(
          (pack) => pack.currencyNumber.toString() === selectedFlexPack
        )?.unitPrice || CURRENCY_RATES.FLEX
      : CURRENCY_RATES.FLEX;

  return (
    <div className="flex flex-col items-start mb-2 relative">
      <span className="ml-6 pl-2 pr-2 relative top-2  text-sm font-medium bg-[#0A0800]">
        Boss Fighters
      </span>
      <div className="flex items-center gap-4 px-4 py-2 rounded-full border-2 border-white bg-background/80">
        <div className="flex items-center gap-2">
          <img src={Flex} alt="Flex token" className="h-5 w-5" />
          <span className="text-sm font-medium text-white">${flexPrice}</span>
        </div>
        <div className="flex items-center gap-2">
          <img src={Token3} alt="Token 3" className="h-5 w-5" />
          <span className="text-sm font-medium text-white">
            ${CURRENCY_RATES.BFT}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <img src={Token4} alt="Token 4" className="h-5 w-5" />
          <span className="text-sm font-medium text-white">
            ${CURRENCY_RATES.BFT}
          </span>
        </div>
      </div>
    </div>
  );
}
