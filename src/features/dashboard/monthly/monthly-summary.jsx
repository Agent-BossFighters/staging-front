import { Flex, Token4, Purse, Spark, Win, Draw, Loss } from "@img/index";

export default function MonthlySummary({ date, metrics }) {
  const formatMonth = (date) => {
    return date
      .toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  };

  const calculateBftValue = (bft) => {
    return (bft * 0.01).toFixed(2);
  };

  const calculateFlexValue = (flex) => {
    return (flex * 0.00744).toFixed(2);
  };

  const calculateEnergyCost = (energy) => {
    return (energy * 1.49).toFixed(2);
  };

  const calculateTotalProfit = () => {
    if (!metrics) return "0.00";
    const bftValue = parseFloat(calculateBftValue(metrics.total_bft || 0));
    const flexValue = parseFloat(calculateFlexValue(metrics.total_flex || 0));
    const energyCost = parseFloat(
      calculateEnergyCost(metrics.total_energy || 0)
    );
    return (bftValue + flexValue - energyCost).toFixed(2);
  };

  return (
    <div className="flex border-2 border-yellow-400 rounded-lg h-[140px] mb-10 w-[75%]">
      {/* Date section */}
      <div className="bg-yellow-400 flex flex-col justify-center items-center px-16">
        <p className="text-black text-2xl font-bold">
          {formatMonth(date).split(" ")[0]}
        </p>
        <p className="text-black text-2xl font-bold">
          {formatMonth(date).split(" ")[1]}
        </p>
      </div>

      {/* Metrics section */}
      <div className="flex items-center justify-around flex-grow gap-6 text-white py-4">
        {/* Matches count and results */}
        <div className="flex flex-col items-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <img src={Win} alt="Victories" className="w-5 h-5" />
              <span className="text-green-500">{metrics?.total_wins || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <img src={Loss} alt="Defeats" className="w-5 h-5" />
              <span className="text-red-500">{metrics?.total_losses || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <img src={Draw} alt="Draws" className="w-5 h-5" />
              <span className="text-yellow-500">
                {metrics?.total_draws || 0}
              </span>
            </div>
          </div>
          <p>MATCHES PLAYED</p>
          <p className="text-xl">{metrics?.total_matches || 0}</p>
        </div>

        {/* Energy Used */}
        <div className="flex flex-col items-center">
          <img src={Spark} alt="Energy" className="w-6 h-10" />
          <p>ENERGY USED</p>
          <p className="text-red-500 text-xl">{metrics?.total_energy || 0}</p>
          <p className="text-red-500 text-sm">
            ${calculateEnergyCost(metrics?.total_energy || 0)}
          </p>
        </div>

        {/* $BFT */}
        <div className="flex flex-col items-center">
          <img src={Token4} alt="bft" className="w-10 h-10" />
          <p>TOTAL $BFT</p>
          <p className="text-accent text-xl">{metrics?.total_bft || 0}</p>
          <p className="text-accent text-sm">
            ${calculateBftValue(metrics?.total_bft || 0)}
          </p>
        </div>

        {/* FLEX */}
        <div className="flex flex-col items-center">
          <img src={Flex} alt="flex" className="w-10 h-10" />
          <p>TOTAL FLEX</p>
          <p className="text-accent text-xl">{metrics?.total_flex || 0}</p>
          <p className="text-accent text-sm">
            ${calculateFlexValue(metrics?.total_flex || 0)}
          </p>
        </div>

        {/* Profit */}
        <div className="flex flex-col items-center">
          <img src={Purse} alt="Profit" className="w-8 h-8" />
          <p>PROFIT</p>
          <p className="text-green-500 text-2xl">${calculateTotalProfit()}</p>
        </div>
      </div>
    </div>
  );
}
