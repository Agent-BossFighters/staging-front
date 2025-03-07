import { useState, useEffect } from "react";
import { getData } from "@utils/api/data";
import MonthlyMatches from "@features/dashboard/monthly/monthly-matches";
import MonthlySummary from "@features/dashboard/monthly/monthly-summary";
import MonthSelector from "@features/dashboard/monthly/MonthSelector";

export default function MonthlyPage() {
  console.log("MonthlyPage component mounted");
  const [dailyMetrics, setDailyMetrics] = useState({});
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchMonthlyData = async () => {
    setLoading(true);
    try {
      // S'assurer que le mois est sur 2 chiffres
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const year = selectedDate.getFullYear();
      const formattedDate = `${year}-${month}`;

      console.log("📅 Date formatée:", formattedDate);
      console.log("🚀 Fetching monthly summary for:", formattedDate);
      const monthlyResponse = await getData(
        `v1/summaries/monthly/${formattedDate}`
      );
      console.log("📦 Monthly API Response:", monthlyResponse);

      console.log("🚀 Fetching monthly matches for:", formattedDate);
      const matchesResponse = await getData(
        `v1/matches/monthly/${formattedDate}`
      );
      console.log("📦 Matches API Response:", matchesResponse);

      if (monthlyResponse) {
        // Transformer la réponse pour correspondre à la structure attendue
        const monthlyTotals = {
          total_matches: monthlyResponse.total_matches,
          total_energy: monthlyResponse.total_energy,
          total_bft: monthlyResponse.total_bft.amount,
          total_flex: monthlyResponse.total_flex.amount,
          profit: monthlyResponse.profit,
          total_wins: monthlyResponse.results.win,
          total_losses: monthlyResponse.results.loss,
          total_draws: monthlyResponse.results.draw,
          win_rate: monthlyResponse.results.win
            ? (
                (monthlyResponse.results.win / monthlyResponse.total_matches) *
                100
              ).toFixed(1)
            : "0.0",
        };

        console.log("✅ Setting monthly totals:", monthlyTotals);
        setMonthlyTotals(monthlyTotals);
      } else {
        console.warn("⚠️ No monthly response from API");
        setMonthlyTotals({});
      }

      if (matchesResponse?.matches) {
        // Les données sont déjà groupées par jour dans la réponse
        const dailyMetrics = {};

        // Transformer chaque jour pour correspondre à notre format
        Object.entries(matchesResponse.matches).forEach(([date, dayData]) => {
          dailyMetrics[date] = {
            total_matches: dayData.total_matches,
            total_energy: dayData.total_energy,
            total_bft: dayData.total_bft.amount,
            total_flex: dayData.total_flex.amount,
            wins: dayData.results.win,
            losses: dayData.results.loss,
            draws: dayData.results.draw,
            total_energy_cost: dayData.total_energy_cost,
            total_bft_value: dayData.total_bft.value,
            total_flex_value: dayData.total_flex.value,
            total_profit: dayData.profit,
            win_rate: dayData.win_rate,
          };
        });

        console.log("✅ Setting daily metrics:", dailyMetrics);
        setDailyMetrics(dailyMetrics);
      } else {
        console.warn("⚠️ No matches in response");
        setDailyMetrics({});
      }
    } catch (error) {
      console.error("❌ Error fetching monthly data:", error);
      setDailyMetrics({});
      setMonthlyTotals({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔄 Effect triggered with date:", selectedDate);
    fetchMonthlyData();
  }, [selectedDate]);

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  return (
    <div className="w-5/6 mx-auto h-full">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-5xl font-extrabold text-primary">MONTHLY</h1>
        <MonthSelector
          selectedDate={selectedDate}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          dailyMetrics={dailyMetrics}
        />
      </div>

      <MonthlySummary date={selectedDate} metrics={monthlyTotals} />
      <MonthlyMatches
        dailyMetrics={dailyMetrics}
        monthlyTotals={monthlyTotals}
        loading={loading}
      />
    </div>
  );
}
