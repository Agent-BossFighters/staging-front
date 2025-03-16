import { Flex, Token4, Purse, Spark, Win, Draw, Loss } from "@img/index";
import { useUserPreference } from "@context/userPreference.context";

export default function MonthlySummary({ date, metrics }) {
  const { streamerMode } = useUserPreference();
  
  const formatMonth = (date) => {
    return date
      .toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  };

  if (!metrics) {
    return null;
  }

  return (
    <div className="flex border-2 border-yellow-400 rounded-lg mb-10 w-[auto]">
      {/* Date section */}
      <div className="w-1/6 bg-yellow-400 flex flex-col justify-center items-center px-16">
        <p className="text-black text-4xl font-bold">
          {formatMonth(date).split(" ")[0]}
        </p>
        <p className="text-black text-4xl font-bold">
          {formatMonth(date).split(" ")[1]}
        </p>
      </div>

      {/* Metrics section */}
      <div className="pt-4 pb-4 flex items-center justify-around flex-grow gap-6 text-white py-4">
        {/* Matches count and results */}
        <div className="pb-4 flex flex-col items-center gap-2">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <img src={Win} alt="Victories" className="w-7 h-7" />
              <span className="text-green-500 text-2xl">{metrics.total_wins || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <img src={Draw} alt="Draws" className="w-7 h-7" />
              <span className="pl-1 text-blue-500 text-2xl">
                {metrics.total_draws || 0}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <img src={Loss} alt="Defeats" className="w-7 h-7" />
              <span className="pl-1 text-red-500 text-2xl">{metrics.total_losses || 0}</span>
            </div>
          </div>
          <p className="text-2xl justify-center font-bold">MATCH(ES)</p>
          <p className="text-3xl">{metrics.total_matches || 0}</p>
        </div>

        {/* Energy Used - Afficher la quantité mais pas le coût en mode streamer */}
        <div className="flex flex-col items-center gap-1">
          <img src={Spark} alt="Energy" className="w-6 h-10" />
          <p className="text-2xl font-bold">ENERGY USED</p>
          <p className="text-red-500 text-2xl">{metrics.total_energy || 0}</p>
          {!streamerMode && (
            <p className="text-red-500 text-2sm">
              ${metrics.total_energy_cost || "0.00"}
            </p>
          )}
        </div>

        {/* Total$BFT - Afficher la quantité mais pas la valeur en mode streamer */}
        <div className="flex flex-col items-center gap-1">
          <img src={Token4} alt="bft" className="w-10 h-10" />
          <p className="text-2xl font-bold">$BFT</p>
          <p className="text-green-500 text-2xl">{metrics.total_bft || 0}</p>
          {!streamerMode && (
            <p className="text-green-500 text-2sm">
              ${metrics.total_bft_value || "0.00"}
            </p>
          )}
        </div>

        {/* Total Flex - Afficher la quantité mais pas la valeur en mode streamer */}
        <div className="flex flex-col items-center gap-1">
          <img src={Flex} alt="flex" className="w-10 h-10" />
          <p className="text-2xl font-bold">FLEX</p>
          <p className="text-green-500 text-2xl">{metrics.total_flex || 0}</p>
          {!streamerMode && (
            <p className="text-green-500 text-2sm">
              ${metrics.total_flex_value || "0.00"}
            </p>
          )}
        </div>

        {/* Profit - Ne pas afficher du tout en mode streamer */}
        {!streamerMode && (
          <div className="pb-4 flex flex-col items-center gap-2">
            <img src={Purse} alt="Profit" className="w-8 h-10" />
            <p className="text-2xl font-bold">PROFIT</p>
            <p className="text-green-500 text-3xl">${metrics.profit || "0.00"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
