import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { Button } from "@ui/button";
import { useUserPreference } from "@context/userPreference.context";
import { useState, useEffect } from "react";
import { formatPrice, formatNumber, formatPercent } from "@utils/formatters";
import { useTableScroll } from "@shared/hook/useTableScroll";
import ScrollControls from "@ui/scroll-controls";

export default function MonthlyMatches({
  dailyMetrics,
  monthlyTotals,
  loading,
}) {
  const { streamerMode } = useUserPreference();
  const [sortedEntries, setSortedEntries] = useState([]);

  useEffect(() => {
    if (dailyMetrics) {
      // Convertir l'objet en tableau d'entrées et trier par date
      const entries = Object.entries(dailyMetrics).sort(
        (a, b) => new Date(b[0]) - new Date(a[0])
      );
      setSortedEntries(entries);
    }
  }, [dailyMetrics]);

  const {
    tableRef,
    visibleItems: visibleEntries,
    showScrollMessage,
    isAtStart,
    isAtEnd,
    handleMouseEnter,
    handleMouseLeave,
    startScrollingUp,
    stopScrollingUp,
    startScrollingDown,
    stopScrollingDown,
  } = useTableScroll({
    items: sortedEntries,
    visibleRowsCount: 8,
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 min-h-[200px] bg-background text-foreground">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-4 w-48 bg-muted-foreground/30 rounded"></div>
          <div className="h-4 w-36 bg-muted-foreground/20 rounded"></div>
        </div>
      </div>
    );
  }

  // Calculer le temps total pour un jour
  const calculateDailyIGTime = (dayData) => {
    if (!dayData || !Array.isArray(dayData.matches)) {
      return 0;
    }

    const totalTime = dayData.matches.reduce((total, match) => {
      if (!match || typeof match.time !== "number") {
        return total;
      }
      return total + match.time;
    }, 0);
    return totalTime;
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div
        className="flex-grow overflow-x-auto"
        ref={tableRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">DATE</TableHead>
              <TableHead className="text-left">
                MATCHES
                <br /> PLAYED
              </TableHead>
              <TableHead className="text-left">
                IG TIME
                <br /> (Min)
              </TableHead>
              <TableHead className="text-left">
                ENERGY
                <br /> USED
              </TableHead>

              {/* Masquer les colonnes financières en mode streamer */}
              {!streamerMode && (
                <TableHead className="text-left text-destructive">
                  ENERGY
                  <br /> COST
                </TableHead>
              )}
              <TableHead className="text-left">
                TOTAL
                <br /> $BFT
              </TableHead>

              {/* Masquer les colonnes financières en mode streamer */}
              {!streamerMode && (
                <TableHead className="text-left text-accent">BFT ($)</TableHead>
              )}
              <TableHead className="text-left">FLEX</TableHead>

              {/* Masquer les colonnes financières en mode streamer */}
              {!streamerMode && (
                <>
                  <TableHead className="text-left text-accent">
                    FLEX ($)
                  </TableHead>
                  <TableHead className="text-left text-green-500">
                    PROFIT
                  </TableHead>
                </>
              )}
              <TableHead className="text-left">WIN RATE</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {visibleEntries.map(([date, metrics]) => {
              return (
                <TableRow key={date} className="border-b border-border">
                  <TableCell>{new Date(date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-left">
                    {formatNumber(metrics.total_matches)}
                  </TableCell>
                  <TableCell className="text-left">
                    {formatNumber(calculateDailyIGTime(metrics))}
                  </TableCell>
                  <TableCell className="text-left">
                    {formatNumber(metrics.total_energy, 1)}
                  </TableCell>

                  {/* Masquer les colonnes financières en mode streamer */}
                  {!streamerMode && (
                    <TableCell className="text-left text-destructive">
                      {formatPrice(metrics.total_energy_cost)}
                    </TableCell>
                  )}
                  <TableCell className="text-left">
                    {formatNumber(metrics.total_bft)}
                  </TableCell>

                  {/* Masquer les colonnes financières en mode streamer */}
                  {!streamerMode && (
                    <TableCell className="text-left text-accent">
                      {formatPrice(metrics.total_bft_value)}
                    </TableCell>
                  )}
                  <TableCell className="text-left">
                    {formatNumber(metrics.total_flex)}
                  </TableCell>

                  {/* Masquer les colonnes financières en mode streamer */}
                  {!streamerMode && (
                    <>
                      <TableCell className="text-left text-accent">
                        {formatPrice(metrics.total_flex_value)}
                      </TableCell>

                      <TableCell className="text-left text-green-500">
                        {formatPrice(metrics.total_profit)}
                      </TableCell>
                    </>
                  )}
                  <TableCell className="text-left">
                    {formatPercent(metrics.win_rate, 2)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <ScrollControls
          showScrollMessage={showScrollMessage}
          isAtStart={isAtStart}
          isAtEnd={isAtEnd}
          startScrollingUp={startScrollingUp}
          stopScrollingUp={stopScrollingUp}
          startScrollingDown={startScrollingDown}
          stopScrollingDown={stopScrollingDown}
        />
        <div className="text-center text-sm text-muted-foreground py-2">
          Monthly statistics summary
        </div>
      </div>
    </div>
  );
}
