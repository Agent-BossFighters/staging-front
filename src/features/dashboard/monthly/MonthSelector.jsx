import { Button } from "@ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MonthlyDownload from "./MonthlyDownload";

export default function MonthSelector({
  selectedDate,
  onPreviousMonth,
  onNextMonth,
  dailyMetrics,
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onPreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xl font-semibold min-w-[200px] text-center">
          {selectedDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <Button variant="outline" size="icon" onClick={onNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button >
        <MonthlyDownload dailyMetrics={dailyMetrics} />
      </div>
    </div>
  );
}
