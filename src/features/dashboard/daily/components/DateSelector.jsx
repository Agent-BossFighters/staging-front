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
  // Convertir en UTC
  currentDate.setUTCHours(0, 0, 0, 0);
  
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setUTCDate(currentDate.getUTCDate() - maxDaysBack);
  
  const selectedDateMidnight = new Date(selectedDate);
  selectedDateMidnight.setUTCHours(0, 0, 0, 0);
  
  const isPreviousDisabled = selectedDateMidnight.getTime() <= sevenDaysAgo.getTime();
  const isNextDisabled = selectedDateMidnight.getTime() > currentDate.getTime();

  // Fonction pour formater les dates pour la comparaison en UTC
  const formatDateForComparison = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Vérifier si la date sélectionnée est aujourd'hui (en UTC)
  const isToday = formatDateForComparison(selectedDateMidnight) === formatDateForComparison(currentDate);

  // Formater la date en UTC pour l'affichage
  const formatDateDisplay = (date) => {
    const utcDate = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    ));
    
    return utcDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: 'UTC'
    });
  };

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
          {formatDateDisplay(selectedDate)}
          <span className="text-xs text-muted-foreground ml-2">(UTC)</span>
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