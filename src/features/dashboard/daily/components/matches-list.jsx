import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import CreateMatchForm from "@features/dashboard/daily/components/create-match-form";
import MatchEntry from "@features/dashboard/daily/components/match-entry";

export default function MatchesList({
  matches,
  builds,
  loading,
  editingMatchId,
  editedData,
  onAdd,
  onUpdate,
  onDelete,
  onEdit,
  onEditField,
  onCancel,
  unlockedSlots,
}) {
  const renderSlotHeaders = () => {
    return Array.from({ length: unlockedSlots }, (_, i) => (
      <TableHead key={i}>SLOT {i + 1}</TableHead>
    ));
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-4 w-48 bg-muted-foreground/30 rounded"></div>
            <div className="h-4 w-36 bg-muted-foreground/20 rounded"></div>
          </div>
        </div>
      );
    }

    return (
      <Table>
        <TableCaption>Liste des matchs du jour</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>BUILD</TableHead>
            {renderSlotHeaders()}
            <TableHead>LUCK RATE</TableHead>
            <TableHead>TIME<br />MINUTES</TableHead>
            <TableHead>ENERGY<br />USED</TableHead>
            <TableHead>ENERGY<br />COST</TableHead>
            <TableHead>MAP</TableHead>
            <TableHead>RESULT</TableHead>
            <TableHead>BFT</TableHead>
            <TableHead>BFT<br />VALUE</TableHead>
            <TableHead>FLEX</TableHead>
            <TableHead>FLEX<br />VALUE</TableHead>
            <TableHead>PROFIT</TableHead>
            <TableHead>BFT<br />MULTIPLIER</TableHead>
            <TableHead>PERKS<br />MULTIPLIER</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <CreateMatchForm builds={builds} onSubmit={onAdd} unlockedSlots={unlockedSlots} />
          {matches.map((match) => (
            <MatchEntry
              key={match.id}
              match={match}
              builds={builds}
              isEditing={match.id === editingMatchId}
              editedData={editedData}
              onEdit={() => onEdit(match)}
              onDelete={() => onDelete(match.id)}
              onSave={() => onUpdate(match.id)}
              onCancel={onCancel}
              onEditField={onEditField}
              unlockedSlots={unlockedSlots}
            />
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div>
      <h2 className="text-3xl font-extrabold py-2">MATCHES</h2>
      {renderContent()}
    </div>
  );
}
