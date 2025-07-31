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
import { useTableScroll } from "@shared/hook/useTableScroll";
import ScrollControls from "@ui/scroll-controls";

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
  initialMatchData,
  totalEnergyUsed,
  totalPriceEnergyUsed
}) {
  const { streamerMode } = useUserPreference();

  const {
    tableRef,
    visibleItems: visibleMatches,
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
    items: matches,
    visibleRowsCount: 8,
  });

  const renderSlotHeaders = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <TableHead key={i} className="w-[4%]">
        SLOT {i + 1}
      </TableHead>
    ));
  };

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
                BOOST
              </TableHead>
              {renderSlotHeaders()}
              <TableHead className="w-[4%]">
                LUCK
                <br />
                RATE
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
                <TableHead className="w-[4%] text-accent">$BFT ($)</TableHead>
              )}

              <TableHead className="w-[4%]">
                BFT /
                <br />
                ENERGY
              </TableHead>

              {/* Masquer les colonnes financières en mode streamer */}
              {!streamerMode && (
                <TableHead className="w-[4%]">
                  $ /
                  <br />
                  ENERGY
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
                  <TableHead className="w-[5%]">PROFIT</TableHead>
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
              totalEnergyUsed={totalEnergyUsed}
              totalPriceEnergyUsed={totalPriceEnergyUsed}
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
                totalEnergyUsed={totalEnergyUsed}
                totalPriceEnergyUsed={totalPriceEnergyUsed}
              />
            ))}
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
      </div>
      <div className="text-center text-sm text-muted-foreground py-2">
        Daily matches history and statistics
      </div>
    </div>
  );
}
