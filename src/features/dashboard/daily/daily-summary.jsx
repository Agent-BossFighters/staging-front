import { Flex, Token4, Purse, Spark, Win, Draw, Loss } from "@img/index";
import { useUserPreference } from "@context/userPreference.context";
import { formatNumber, formatPrice } from "@utils/formatters";
export default function DailySummary({ date, summary }) {
  const { streamerMode } = useUserPreference();

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const day = d.toUTCString().slice(5, 7);
    const month = new Date(d).toUTCString().slice(8, 11).toUpperCase();
    const year = d.getUTCFullYear();
    return { dayMonth: `${day} ${month}`, day: `${day}`, month: `${month}`, year };
  };

  if (!summary) {
    return null;
  }

  return (
    <div className="flex flex-row md:flex-col w-full h-full border-2 border-yellow-400 rounded-lg mb-10">
      {/* Date section supprimé car déjà présente dans le sélecteur => pas de valeur ajoutée
      
      <div className="flex flex-row xl:flex-col xl:w-1/6 w-full bg-yellow-400 justify-center items-center px-8">
        <p className="text-black text-4xl 2xl:text-7xl font-bold">
          {formatDate(date).day}
        </p>
        <p className="text-black text-4xl font-bold">
          {formatDate(date).month}
        </p>
      </div>
      */}
      {/* Metrics section */}
      <div className="flex flex-wrap p-6 items-center justify-around text-white gap-10">
        {/* Matches count and results */}
        <div className="pb-4 flex flex-col items-center gap-2">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <img src={Win} alt="Victories" className="w-5 h-5" />
              <span className="pl-1 text-green-500 text-lg">
                {formatNumber(summary.results.win)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <img src={Draw} alt="Draws" className="w-5 h-5" />
              <span className="pl-1 text-blue-500 text-lg">
                {formatNumber(summary.results.draw)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <img src={Loss} alt="Defeats" className="w-5 h-5" />
              <span className="pl-1 text-red-500 text-lg">
                {formatNumber(summary.results.loss)}
              </span>
            </div>
          </div>
          <p className="text-lg xl:text-2xl justify-center font-bold">MATCH(ES)</p>
          <p className="text-3xl">{formatNumber(summary.matchesCount)}</p>
        </div>

        {/* Energy used - Afficher la quantité mais pas le coût en mode streamer */}
        <div className="flex flex-col items-center gap-1">
          <img src={Spark} alt="Energy" className="w-6 h-10" />
          <p className="text-lg xl:text-2xl font-bold">ENERGY USED</p>
          <p className="text-red-500 text-2xl">
            {formatNumber(summary.energyUsed.amount, 3)}
          </p>
          {!streamerMode && (
            <p className="text-red-500 text-2sm">
              {formatPrice(summary.energyUsed.cost)}
            </p>
          )}
        </div>

        {/* Total BFT - Afficher la quantité mais pas la valeur en mode streamer */}
        <div className="flex flex-col items-center gap-1">
          <img src={Token4} alt="bft" className="w-10 h-10" />
          <p className="text-lg xl:text-2xl font-bold">$BFTOKEN</p>
          <p className="text-green-500 text-2xl">
            {formatNumber(summary.totalBft.amount, 3)}
          </p>
          {!streamerMode && (
            <p className="text-green-500 text-2sm">
              {formatPrice(summary.totalBft.value)}
            </p>
          )}
        </div>

        {/* Total Flex - Afficher la quantité mais pas la valeur en mode streamer */}
        <div className="flex flex-col items-center gap-1">
          <img src={Flex} alt="flex" className="w-10 h-10" />
          <p className="text-lg xl:text-2xl font-bold">FLEX</p>
          <p className="text-green-500 text-2xl">
            {formatNumber(summary.totalFlex.amount)}
          </p>
          {!streamerMode && (
            <p className="text-green-500 text-2sm">
              {formatPrice(summary.totalFlex.value)}
            </p>
          )}
        </div>

        {/* Profit - Ne pas afficher du tout en mode streamer */}
        {!streamerMode && (
          <div className="pb-4 flex flex-col items-center gap-3">
            <img src={Purse} alt="Profit" className="w-8 h-8" />
            <p className="text-lg xl:text-2xl font-bold">PROFIT</p>
            {summary.profit > 0 ? (
              <p className="text-green-500 text-3xl">
                {formatPrice(summary.profit)}
              </p>
            ) : (
              <p className="text-red-500 text-3xl">
                {formatPrice(summary.profit)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
