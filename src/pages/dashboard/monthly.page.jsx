import { useState, useEffect } from "react";
import { getData } from "@utils/api/data";
import MonthlyMatches from "@features/dashboard/monthly/monthly-matches";
import MonthlySummary from "@features/dashboard/monthly/monthly-summary";
import { Button } from "@ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MonthlyPage() {
  console.log("MonthlyPage component mounted");
  const [dailyMetrics, setDailyMetrics] = useState({});
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchMonthlyData = async () => {
    setLoading(true);
    try {
      const formattedDate = `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1
      ).padStart(2, "0")}`;

      console.log("🚀 Fetching data for:", formattedDate);
      const response = await getData(
        `v1/matches/monthly_metrics/${formattedDate}`
      );
      console.log("📦 API Response:", response);

      if (response?.daily_metrics) {
        console.log("✅ Setting daily metrics:", response.daily_metrics);
        setDailyMetrics(response.daily_metrics);
      } else {
        console.warn("⚠️ No daily metrics in response");
        setDailyMetrics({});
      }

      if (response?.monthly_totals) {
        console.log("✅ Setting monthly totals:", response.monthly_totals);
        setMonthlyTotals(response.monthly_totals);
      } else {
        console.warn("⚠️ No monthly totals in response");
        setMonthlyTotals({});
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
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground">
      <div className="flex items-center justify-between px-5 py-4">
        <h1 className="text-6xl font-extrabold text-primary">MONTHLY</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xl font-semibold min-w-[200px] text-center">
            {selectedDate.toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="px-5 mb-6">
        <MonthlySummary date={selectedDate} metrics={monthlyTotals} />
      </div>

      <MonthlyMatches
        dailyMetrics={dailyMetrics}
        monthlyTotals={monthlyTotals}
        loading={loading}
      />
    </div>
  );
}
