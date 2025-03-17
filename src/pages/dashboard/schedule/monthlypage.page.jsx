import { useState } from "react";
import MonthlyMatches from "@features/dashboard/monthly/monthly-matches";
import MonthlySummary from "@features/dashboard/monthly/monthly-summary";
import MonthSelector from "@features/dashboard/monthly/MonthSelector";
import { useMonthlyData } from "@features/dashboard/monthly/hooks/useMonthlyData";
import { useEffect } from "react";

export default function MonthlyPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const {
    monthlyTotals,
    dailyMetrics,
    loading,
    error,
    fetchMonthlyData,
  } = useMonthlyData();

  useEffect(() => {
    fetchMonthlyData(selectedDate);
  }, [selectedDate, fetchMonthlyData]);

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
