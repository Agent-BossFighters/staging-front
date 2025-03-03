import { Flex, Token3, Token4 } from "@img/index";
import { useGameConstants } from "@context/gameConstants.context";

export default function CurrencyDisplay() {
  const { CURRENCY_RATES } = useGameConstants();

  return (
    <div className="flex flex-col items-start mb-2">
      <span className="text-sm font-medium mb-1">Boss Fighters</span>
      <div className="flex items-center gap-4 px-4 py-2 rounded-full border border-white/20 bg-background/80">
        <div className="flex items-center gap-2">
          <img src={Flex} alt="Flex token" className="h-5 w-5" />
          <span className="text-sm font-medium text-white">
            ${CURRENCY_RATES.FLEX}
          </span>
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
