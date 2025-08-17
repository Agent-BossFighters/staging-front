import { Button } from "@ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { useGameConstants } from "@context/gameConstants.context";

export default function MonthlyDownload({ dailyMetrics }) {
  const { CURRENCY_RATES } = useGameConstants();


  const calculateBftValue = (bft) => {
    return (bft * CURRENCY_RATES.BFT).toFixed(2);
  };

  const calculateFlexValue = (flex) => {
    return (flex * CURRENCY_RATES.FLEX).toFixed(2);
  };

  const calculateProfit = (bftValue, flexValue, energyCost) => {
    return (
      parseFloat(bftValue) +
      parseFloat(flexValue) -
      parseFloat(energyCost)
    ).toFixed(2);
  };

  const handleDownload = () => {
    const data = Object.entries(dailyMetrics || {}).map(([date, metrics]) => {
      const energyCost = metrics.total_energy_cost;
      const bftValue = calculateBftValue(metrics.total_bft);
      const flexValue = calculateFlexValue(metrics.total_flex);
      const profit = calculateProfit(bftValue, flexValue, energyCost);

      return {
        Date: new Date(date).toLocaleDateString(),
        "Matches Played": metrics.total_matches,
        "Energy Used": metrics.total_energy,
        "Energy Cost ($)": metrics.total_energy_cost,
        "Total $BFT": metrics.total_bft,
        "BFT Value ($)": bftValue,
        FLEX: metrics.total_flex,
        "FLEX Value ($)": flexValue,
        "Profit ($)": profit,
        "Win Rate (%)": metrics.win_rate,
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Monthly Report");
    XLSX.writeFile(
      wb,
      `monthly_report_${new Date().toISOString().slice(0, 7)}.xlsx`
    );
  };

  return (
    <Button
      onClick={handleDownload}
      className="justify-center whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-background shadow hover:bg-primary/90 font-bold uppercase h-12 w-full py-2 flex items-center gap-2 transition-transform duration-200 hover:scale-105"
    >
      <Download className="w-5 h-5 stroke-[3]" />
      DOWNLOAD
    </Button>
  );
}
