import { Flex, Token4, Purse, Spark, Win, Draw, Loss } from "@img/index";

export default function DailySummary({ date, summary }) {
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="flex border-2 border-yellow-400 rounded-lg h-full">
      {/* Date section */}
      <div className="bg-yellow-400 flex flex-col justify-center items-center">
        <p className="text-black text-xl font-bold px-4">{formatDate(date)}</p>
      </div>

      {/* Metrics section */}
      <div className="flex items-center justify-around flex-grow text-white py-4">
        {/* Matches count and results */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xl font-semibold">MATCHES PLAYED</p>
          <p className="text-white text-xl font-semibold">
            {summary.matchesCount}
          </p>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1">
              <img src={Win} alt="Victories" className="w-5 h-5" />
              <span className="text-green-500">{summary.results.win}</span>
            </div>
            <div className="flex items-center gap-1">
              <img src={Loss} alt="Defeats" className="w-5 h-5" />
              <span className="text-red-500">{summary.results.loss}</span>
            </div>
            <div className="flex items-center gap-1">
              <img src={Draw} alt="Draws" className="w-5 h-5" />
              <span className="text-yellow-500">{summary.results.draw}</span>
            </div>
          </div>
        </div>

        {/* Energy used */}
        <div className="flex flex-col items-center">
          <img src={Spark} alt="Energy" className="w-6 h-10 mr-2" />
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
          <img src={Purse} alt="Profit" className="w-8 h-8 mr-2" />
          <p>PROFIT</p>
          <p className="text-green-500 text-2xl">{summary.profit}</p>
        </div>
      </div>
    </div>
  );
}
