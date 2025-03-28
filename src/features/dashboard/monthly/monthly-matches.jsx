import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { useUserPreference } from "@context/userPreference.context";
import { useState, useEffect, useRef } from "react";
import { formatPrice, formatNumber, formatPercent } from "@utils/formatters";

export default function MonthlyMatches({
  dailyMetrics,
  monthlyTotals,
  loading,
}) {
  const { streamerMode } = useUserPreference();
  const [startIndex, setStartIndex] = useState(0);
  const [isMouseOverTable, setIsMouseOverTable] = useState(false);
  const [showScrollMessage, setShowScrollMessage] = useState(false);
  const tableRef = useRef(null);
  
  // Nombre de lignes à afficher  
  const visibleRowsCount = 8;
  
  useEffect(() => {
    if (dailyMetrics) {
      setShowScrollMessage(Object.keys(dailyMetrics).length > visibleRowsCount);
    }
  }, [dailyMetrics]);
  
  useEffect(() => {
    const wheelHandler = (e) => {
      if (!isMouseOverTable || !dailyMetrics) return;
      
      // Si la souris est sur le tableau, empêcher le défilement de la page
      e.preventDefault();
      
      const totalEntries = Object.keys(dailyMetrics).length;
      if (totalEntries <= visibleRowsCount) return;
      
      if (e.deltaY > 0) {
        // Défilement vers le bas
        setStartIndex(prev => Math.min(prev + 1, totalEntries - visibleRowsCount));
      } else if (e.deltaY < 0) {
        // Défilement vers le haut
        setStartIndex(prev => Math.max(prev - 1, 0));
      }
    };
    
    window.addEventListener('wheel', wheelHandler, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', wheelHandler);
    };
  }, [isMouseOverTable, dailyMetrics, visibleRowsCount]);

  const handleMouseEnter = () => {
    setIsMouseOverTable(true);
  };
  
  const handleMouseLeave = () => {
    setIsMouseOverTable(false);
  };

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
      if (!match || typeof match.time !== 'number') {
        return total;
      }
      return total + match.time;
    }, 0);
    return totalTime;
  };
  
  // Sélectionner les entrées visibles en fonction de l'indice de départ
  const visibleEntries = dailyMetrics 
    ? Object.entries(dailyMetrics)
        .sort((a, b) => new Date(b[0]) - new Date(a[0])) // Tri par date, plus récent en premier
        .slice(startIndex, startIndex + visibleRowsCount)
    : [];

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
        
        {showScrollMessage && (
          <div className="text-primary text-center text-3xl py-1">
            ⩔⩔ <span className="text-xl">Scroll down for more</span> ⩔⩔
          </div>
        )}
        <div className="text-center text-sm text-muted-foreground py-2">
          Monthly statistics summary
        </div>
      </div>
      
      {/* Ajouter des contrôles tactiles pour les appareils mobiles si nécessaire */}
      {/* {showScrollMessage && (
        <div className="flex justify-center mt-2 gap-4 md:hidden">
          <button 
            onClick={() => setStartIndex(prev => Math.max(prev - 1, 0))}
            disabled={startIndex === 0}
            className="px-4 py-1 bg-primary/20 rounded-md disabled:opacity-50"
          >
            ↑
          </button>
          <button 
            onClick={() => setStartIndex(prev => Math.min(prev + 1, Object.keys(dailyMetrics || {}).length - visibleRowsCount))}
            disabled={!dailyMetrics || startIndex >= Object.keys(dailyMetrics).length - visibleRowsCount}
            className="px-4 py-1 bg-primary/20 rounded-md disabled:opacity-50"
          >
            ↓
          </button>
        </div>
      )} */}
    </div>
  );
}
