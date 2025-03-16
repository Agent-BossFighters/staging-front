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
}) {
  const { streamerMode } = useUserPreference();

  const renderSlotHeaders = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <TableHead key={i} className="w-[4%]">
        SLOT {i + 1}
      </TableHead>
    ));
  };

  return (
    <div className="flex-grow overflow-y-auto overflow-x-auto">
      <div className="w-full min-w-0">
        <Table className="w-full table-fixed min-w-[1350px]">
          <TableCaption>Daily matches history and statistics</TableCaption>
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
          />
          {matches.map((match) => (
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
            />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
