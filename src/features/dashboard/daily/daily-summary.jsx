import { Flex, Token4 } from "@img/index";
import { Zap, TrendingUp } from "lucide-react";

export default function DailySummary({ date, summary }) {
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="flex border-2 border-yellow-400 rounded-lg h-full">
      {/* Date section */}
      <div className="bg-yellow-400 flex flex-col justify-center items-center">
        <p className="text-dark text-xl font-bold px-4">{formatDate(date)}</p>
      </div>

      {/* Metrics section */}
      <div className="flex items-center justify-around flex-grow text-white py-4">
        {/* Matches count */}
        <div className="flex flex-col items-center">
          <p className="text-xl font-semibold">MATCHES PLAYED</p>
          <p className="text-white text-xl font-semibold">{summary.matchesCount}</p>
        </div>

        {/* Total fees */}
        <div className="flex flex-col items-center">
          <img src={Flex} alt="token" className="w-10 h-10 mr-2" />
          <p>TOTAL FEE</p>
          <p className="text-red-500 text-xl">{summary.totalFees.amount}</p>
          <p className="text-red-500 text-sm">{summary.totalFees.cost}</p>
        </div>

        {/* Energy used */}
        <div className="flex flex-col items-center">
          <Zap className="w-6 h-10 mr-2" />
          <p>ENERGY USED</p>
          <p className="text-red-500 text-xl">{summary.energyUsed.amount}</p>
          <p className="text-red-500 text-sm">{summary.energyUsed.cost}</p>
        </div>

        {/* Total BFT */}
        <div className="flex flex-col items-center">
          <img src={Token4} alt="bft" className="w-10 h-10 mr-2" />
          <p>TOTAL $BFT</p>
          <p className="text-green-500 text-xl">{summary.totalBft.amount}</p>
          <p className="text-green-500 text-sm">{summary.totalBft.value}</p>
        </div>

        {/* Total Flex */}
        <div className="flex flex-col items-center">
          <img src={Flex} alt="flex" className="w-10 h-10 mr-2" />
          <p>TOTAL FLEX</p>
          <p className="text-green-500 text-xl">{summary.totalFlex.amount}</p>
          <p className="text-green-500 text-sm">{summary.totalFlex.value}</p>
        </div>

        {/* Profit */}
        <div className="flex flex-col items-center">
          <TrendingUp className="w-8 h-10 mr-2" />
          <p>PROFIT</p>
          <p className="text-green-500 text-2xl">{summary.profit}</p>
        </div>
      </div>
    </div>
  );
} 