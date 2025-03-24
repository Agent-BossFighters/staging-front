import { Button } from "@ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

export default function DateSelector({
  selectedDate,
  onPreviousDay,
  onNextDay,
  onToday,
  maxDaysBack = 7
}) {
  // Calculer si les boutons doivent être désactivés
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - maxDaysBack);
  
  const selectedDateMidnight = new Date(selectedDate);
  selectedDateMidnight.setHours(0, 0, 0, 0);
  
  const isPreviousDisabled = selectedDateMidnight.getTime() <= sevenDaysAgo.getTime();
  const isNextDisabled = selectedDateMidnight.getTime() > currentDate.getTime();

  // Fonction pour formater les dates pour la comparaison
  const formatDateForComparison = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Vérifier si la date sélectionnée est aujourd'hui
  const isToday = formatDateForComparison(selectedDate) === formatDateForComparison(new Date());

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onPreviousDay}
          disabled={isPreviousDisabled}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xl font-semibold min-w-[150px] text-center">
          {selectedDate.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </span>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onNextDay}
          disabled={isNextDisabled}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          disabled={isToday}
          className="ml-2"
        >
          <CalendarDays className="h-4 w-4 mr-1" />
          Today
        </Button>
      </div>
    </div>
  );
} 