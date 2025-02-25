import { Flex, Token4 } from "@img/index";
import { Zap, TrendingUp } from "lucide-react";

export default function MonthlySummary({ date, metrics }) {
  const formatMonth = (date) => {
    return date
      .toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  };

  return (
    <div className="flex border-2 border-yellow-400 rounded-lg h-full">
      {/* Date section */}
      <div className="bg-yellow-400 flex flex-col justify-center items-center p-8">
        <p className="text-dark text-5xl font-bold">
          {formatMonth(date).split(" ")[0]}
        </p>
        <p className="text-dark text-3xl font-bold">
          {formatMonth(date).split(" ")[1]}
        </p>
      </div>

      {/* Metrics section */}
      <div className="flex items-center justify-around flex-grow text-white py-4">
        {/* Matches count */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold">
              {metrics?.total_matches || 42}
            </span>
          </div>
          <p className="text-xl font-semibold">MATCHES</p>
        </div>

        {/* Energy Used */}
        <div className="flex flex-col items-center">
          <Zap className="w-10 h-10 text-yellow-400 mb-2" />
          <p className="text-xl">ENERGY USED</p>
          <p className="text-red-500 text-xl">{metrics?.total_energy || 35}</p>
          <p className="text-red-500 text-sm">
            ${((metrics?.total_energy || 35) * 1.49).toFixed(2)}
          </p>
        </div>

        {/* $BFT */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold mb-2">
            $
          </div>
          <p className="text-xl">$BFT</p>
          <p className="text-accent text-xl">{metrics?.total_bft || 10570}</p>
          <p className="text-accent text-sm">
            ${((metrics?.total_bft || 10570) * 0.01).toFixed(2)}
          </p>
        </div>

        {/* FLEX */}
        <div className="flex flex-col items-center">
          <img src={Flex} alt="flex" className="w-10 h-10 mb-2" />
          <p className="text-xl">FLEX</p>
          <p className="text-accent text-xl">{metrics?.total_flex || 840}</p>
          <p className="text-accent text-sm">
            ${((metrics?.total_flex || 840) * 0.00744).toFixed(2)}
          </p>
        </div>

        {/* Profit */}
        <div className="flex flex-col items-center">
          <TrendingUp className="w-10 h-10 text-green-500 mb-2" />
          <p className="text-xl">PROFIT</p>
          <p className="text-green-500 text-2xl">
            ${metrics?.profit || "738.61"}
          </p>
        </div>
      </div>
    </div>
  );
}
