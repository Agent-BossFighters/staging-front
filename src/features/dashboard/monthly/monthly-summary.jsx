import { Flex, Token4, Purse, Spark, Win, Draw, Loss } from "@img/index";

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
    <div className="flex border-2 border-yellow-400 rounded-lg h-[140px] mb-10 w-[75%]">
      {/* Date section */}
      <div className="bg-yellow-400 flex flex-col justify-center items-center px-8">
        <p className="text-black text-xl font-bold">
          {formatMonth(date).split(" ")[0]}
        </p>
        <p className="text-black text-xl font-bold">
          {formatMonth(date).split(" ")[1]}
        </p>
      </div>

      {/* Metrics section */}
      <div className="flex items-center justify-around flex-grow gap-6 text-white py-4">
        {/* Matches count and results */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xl font-semibold">MATCHES PLAYED</p>
          <p className="text-white text-xl font-semibold">
            {metrics?.total_matches || 0}
          </p>
          <div className="flex gap-4 mt-2">
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
        </div>

        {/* Energy Used */}
        <div className="flex flex-col items-center">
          <img src={Spark} alt="Energy" className="w-6 h-10 mr-2" />
          <p>ENERGY USED</p>
          <p className="text-red-500 text-xl">{metrics?.total_energy || 0}</p>
          <p className="text-red-500 text-sm">
            ${((metrics?.total_energy || 0) * 1.49).toFixed(2)}
          </p>
        </div>

        {/* $BFT */}
        <div className="flex flex-col items-center">
          <img src={Token4} alt="bft" className="w-10 h-10 mr-2" />
          <p>TOTAL $BFT</p>
          <p className="text-accent text-xl">{metrics?.total_bft || 0}</p>
          <p className="text-accent text-sm">
            ${((metrics?.total_bft || 0) * 0.01).toFixed(2)}
          </p>
        </div>

        {/* FLEX */}
        <div className="flex flex-col items-center">
          <img src={Flex} alt="flex" className="w-10 h-10 mr-2" />
          <p>TOTAL FLEX</p>
          <p className="text-accent text-xl">{metrics?.total_flex || 0}</p>
          <p className="text-accent text-sm">
            ${((metrics?.total_flex || 0) * 0.00744).toFixed(2)}
          </p>
        </div>

        {/* Profit */}
        <div className="flex flex-col items-center">
          <img src={Purse} alt="Profit" className="w-8 h-8 mr-2" />
          <p>PROFIT</p>
          <p className="text-green-500 text-2xl">
            ${metrics?.profit || "0.00"}
          </p>
        </div>
      </div>
    </div>
  );
}
