import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import MatchEntry from "./match-entry";
import { useGameConstants } from "@context/gameConstants.context";
import { useUserPreference } from "@context/userPreference.context";
import { useState, useEffect, useRef } from "react";

export default function MatchesList({
  matches,
  builds,
  unlockedSlots,
  editingMatchId,
  editedData,
  onAdd,
  onUpdate,
  onDelete,
  onEdit,
  onEditField,
  onCancel,
  selectedDate,
  initialMatchData
}) {
  const { streamerMode } = useUserPreference();
  const [showScrollMessage, setShowScrollMessage] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [isMouseOverTable, setIsMouseOverTable] = useState(false);
  const tableRef = useRef(null);
  
  // Nombre de lignes à afficher
  const visibleRowsCount = 8;
  
  useEffect(() => {
    setShowScrollMessage(matches.length > visibleRowsCount);
  }, [matches.length]);
  
  useEffect(() => {
    const wheelHandler = (e) => {
      if (!isMouseOverTable) return;
      
      // Si la souris est sur le tableau, empêcher le défilement de la page
      e.preventDefault();
      
      if (matches.length <= visibleRowsCount) return;
      
      if (e.deltaY > 0) {
        // Défilement vers le bas
        setStartIndex(prev => Math.min(prev + 1, matches.length - visibleRowsCount));
      } else if (e.deltaY < 0) {
        // Défilement vers le haut
        setStartIndex(prev => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('wheel', wheelHandler, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', wheelHandler);
    };
  }, [isMouseOverTable, matches.length, visibleRowsCount]);
  
  const handleMouseEnter = () => {
    setIsMouseOverTable(true);
  };
  
  const handleMouseLeave = () => {
    setIsMouseOverTable(false);
  };

  const renderSlotHeaders = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <TableHead key={i} className="w-[4%]">
        SLOT {i + 1}
      </TableHead>
    ));
  };

  // Sélectionner les lignes visibles en fonction de l'indice de départ
  const visibleMatches = matches.slice(startIndex, startIndex + visibleRowsCount);

  return (
    <div className="flex-grow overflow-x-auto">
      <div 
        className="w-full min-w-0" 
        ref={tableRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Table className="w-full table-fixed min-w-[1350px]">
          <TableHeader>
            <TableRow className="text-xs md:text-sm">
              <TableHead className="w-[6%]">BUILD</TableHead>
              <TableHead className="w-[4%]">
                $BFT %
                <br />
                BONUS
              </TableHead>
              {renderSlotHeaders()}
              <TableHead className="w-[4%]">
                LUCK
                <br />
                RATE
              </TableHead>
              <TableHead className="w-[4%]">
                IG TIME
                <br />
                (MIN)
              </TableHead>
              <TableHead className="w-[4%]">
                ENERGY
                <br />
                USED
              </TableHead>
              
              {/* Masquer les colonnes financières en mode streamer */}
              {!streamerMode && (
                <TableHead className="w-[4%] text-destructive">
                  ENERGY
                  <br />
                  COST
                </TableHead>
              )}
              
              <TableHead className="w-[4%]">MAP</TableHead>
              <TableHead className="w-[4%]">RESULT</TableHead>
              <TableHead className="w-[4%]">$BFT</TableHead>
              
              {/* Masquer les colonnes financières en mode streamer */}
              {!streamerMode && (
                <TableHead className="w-[4%] text-accent">
                  $BFT ($)
                </TableHead>
              )}
              
              <TableHead className="w-[4%]">
                BFT /
                <br />
                MINUTE
              </TableHead>

              {/* Masquer les colonnes financières en mode streamer */}
              {!streamerMode && (
                <TableHead className="w-[4%]">
                  $ /
                  <br />
                  MINUTE
                </TableHead>
              )}
              <TableHead className="w-[3%]">FLEX</TableHead>
              
              {/* Masquer les colonnes financières en mode streamer */}
              {!streamerMode && (
                <>
                  <TableHead className="w-[4%] text-accent">
                    FLEX
                    <br />
                    ($)
                  </TableHead>
                  <TableHead className="w-[5%] text-accent">
                    PROFIT
                  </TableHead>
                </>
              )}
              
              <TableHead className="w-[6%]">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <MatchEntry
              isCreating={true}
              builds={builds}
              unlockedSlots={unlockedSlots}
              onSubmit={onAdd}
              selectedDate={selectedDate}
              initialMatchData={initialMatchData}
            />
            {visibleMatches.map((match) => (
              <MatchEntry
                key={match.id}
                match={match}
                builds={builds}
                isEditing={match.id === editingMatchId}
                editedData={editedData}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpdate={(data) => onUpdate(match.id, data)}
                onEditField={onEditField}
                onCancel={onCancel}
                unlockedSlots={unlockedSlots}
                selectedDate={selectedDate}
              />
            ))}
          </TableBody>
        </Table>
        
        {showScrollMessage && (
          <div className="text-primary text-center text-3xl py-1">
            ⩔⩔ <span className="text-xl">Scroll down for more</span> ⩔⩔
          </div>
        )}
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
            onClick={() => setStartIndex(prev => Math.min(prev + 1, matches.length - visibleRowsCount))}
            disabled={startIndex >= matches.length - visibleRowsCount}
            className="px-4 py-1 bg-primary/20 rounded-md disabled:opacity-50"
          >
            ↓
          </button>
        </div>
      )} */}
      <div className="text-center text-sm text-muted-foreground py-2">
        Daily matches history and statistics
      </div>
    </div>
  );
}
