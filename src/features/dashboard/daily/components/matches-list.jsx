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
  const renderSlotHeaders = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <TableHead key={i}>SLOT {i + 1}</TableHead>
    ));
  };

  return (
    <Table className="w-full">
      <TableCaption>Daily matches history and statistics</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[120px]">BUILD</TableHead>
          {renderSlotHeaders()}
          <TableHead className="min-w-[80px]">
            LUCK
            <br />
            RATE
          </TableHead>
          <TableHead className="min-w-[80px]">
            IN GAME
            <br />
            TIME
          </TableHead>
          <TableHead className="min-w-[80px]">
            ENERGY
            <br />
            USED
          </TableHead>
          <TableHead className="min-w-[80px] text-destructive">
            ENERGY
            <br />
            COST
          </TableHead>
          <TableHead className="min-w-[100px]">MAP</TableHead>
          <TableHead className="min-w-[80px]">RESULT</TableHead>
          <TableHead className="min-w-[80px]">BFT</TableHead>
          <TableHead className="min-w-[80px] text-accent">
            BFT
            <br />
            VALUE
          </TableHead>
          <TableHead className="min-w-[80px]">FLEX</TableHead>
          <TableHead className="min-w-[80px] text-accent">
            FLEX
            <br />
            VALUE
          </TableHead>
          <TableHead className="min-w-[80px] text-green-500">PROFIT</TableHead>
          <TableHead className="min-w-[80px]">
            BFT
            <br />
            MULTIPLIER
          </TableHead>
          <TableHead className="min-w-[80px]">
            PERKS
            <br />
            MULTIPLIER
          </TableHead>
          <TableHead className="min-w-[100px]">ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-y-auto">
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
  );
}
