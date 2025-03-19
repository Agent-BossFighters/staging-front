import { Button } from "@ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { CURRENCY_RATES } from "@shared/constants/currency";

export default function MonthlyDownload({ dailyMetrics }) {
  const calculateEnergyCost = (energy) => {
    return (energy * CURRENCY_RATES.ENERGY).toFixed(2);
  };

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
      const energyCost = calculateEnergyCost(metrics.total_energy);
      const bftValue = calculateBftValue(metrics.total_bft);
      const flexValue = calculateFlexValue(metrics.total_flex);
      const profit = calculateProfit(bftValue, flexValue, energyCost);

      return {
        Date: new Date(date).toLocaleDateString(),
        "Matches Played": metrics.total_matches,
        "IG Time (Min)": metrics.total_matches * 60,
        "Energy Used": metrics.total_energy,
        "Energy Cost ($)": energyCost,
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
      className="bg-yellow-400 text-black hover:bg-yellow-500 flex items-center justify-center gap-6 w-full font-bold  py-5 relative"
    >
      <Download className="w-5 h-5 stroke-[3]" />
      DOWNLOAD
    </Button>
  );
}
