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

  if (!summary) {
    return null;
  }

  return (
    <div className="flex border-2 border-yellow-400 rounded-lg h-[140px] mb-10 w-[75%]">
      {/* Date section */}
      <div className="bg-yellow-400 flex flex-col justify-center items-center px-8">
        <p className="text-black text-xl font-bold">
          {formatDate(date).split(" ")}
        </p>
      </div>

      {/* Metrics section */}
      <div className="flex items-center justify-around flex-grow gap-6 text-white py-4">
        {/* Matches count and results */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <img src={Win} alt="Victories" className="w-5 h-5" />
              <span className="text-green-500">{summary.results.win}</span>
            </div>
            <div className="flex items-center gap-1">
              <img src={Draw} alt="Draws" className="w-5 h-5" />
              <span className="text-blue-500">{summary.results.draw}</span>
            </div>
            <div className="flex items-center gap-1">
              <img src={Loss} alt="Defeats" className="w-5 h-5" />
              <span className="text-red-500">{summary.results.loss}</span>
            </div>
          </div>
          <p>MATCHES PLAYED</p>
          <p className="text-xl">{summary.matchesCount}</p>
        </div>

        {/* Energy used */}
        <div className="flex flex-col items-center gap-1">
          <img src={Spark} alt="Energy" className="w-6 h-10" />
          <p>ENERGY USED</p>
          <p className="text-red-500 text-xl">{summary.energyUsed.amount}</p>
          <p className="text-red-500 text-sm">${summary.energyUsed.cost}</p>
        </div>

        {/* Total BFT */}
        <div className="flex flex-col items-center gap-1">
          <img src={Token4} alt="bft" className="w-10 h-10" />
          <p>TOTAL $BFT</p>
          <p className="text-green-500 text-xl">{summary.totalBft.amount}</p>
          <p className="text-green-500 text-sm">${summary.totalBft.value}</p>
        </div>

        {/* Total Flex */}
        <div className="flex flex-col items-center gap-1">
          <img src={Flex} alt="flex" className="w-10 h-10" />
          <p>TOTAL FLEX</p>
          <p className="text-green-500 text-xl">{summary.totalFlex.amount}</p>
          <p className="text-green-500 text-sm">${summary.totalFlex.value}</p>
        </div>

        {/* Profit */}
        <div className="flex flex-col items-center gap-1">
          <img src={Purse} alt="Profit" className="w-8 h-8" />
          <p>PROFIT</p>
          <p className="text-green-500 text-2xl">${summary.profit}</p>
        </div>
      </div>
    </div>
  );
}
