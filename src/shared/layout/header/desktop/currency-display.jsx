import { Flex, Token3, Token4 } from "@img/index";
import { useGameConstants } from "@context/gameConstants.context";
import { useUserPreference } from "@context/userPreference.context";
import { useCurrencyPacks } from "@features/dashboard/locker/hook/useCurrencyPacks";
import { useAuth } from "@context/auth.context";

export default function CurrencyDisplay() {
  const { user } = useAuth();
  const { CURRENCY_RATES } = useGameConstants();
  const { selectedFlexPack } = useUserPreference();
  const { currencyPacks, loading, error } = useCurrencyPacks();

  // Si l'utilisateur n'est pas connecté ou s'il y a une erreur, ne rien afficher
  if (!user || error) return null;

  const renderCurrencyDisplay = (flexPrice) => (
    <div className="flex flex-col items-start mb-2 relative">
      <span className="ml-6 pl-2 pr-2 relative top-2 text-sm font-medium bg-[#0A0800]">
        Boss Fighters
      </span>
      <div className="flex items-center gap-4 px-4 py-2 rounded-full border border-white bg-background/80">
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

  // Si chargement en cours, afficher avec opacité réduite
  if (loading) {
    return renderCurrencyDisplay(CURRENCY_RATES.FLEX);
  }

  // Calculer le prix unitaire du Flex avec vérification de sécurité
  const flexPrice =
    selectedFlexPack && Array.isArray(currencyPacks) && currencyPacks.length > 0
      ? currencyPacks.find(
          (pack) => pack?.currencyNumber?.toString() === selectedFlexPack
        )?.unitPrice || CURRENCY_RATES.FLEX
      : CURRENCY_RATES.FLEX;

  return renderCurrencyDisplay(flexPrice);
}
