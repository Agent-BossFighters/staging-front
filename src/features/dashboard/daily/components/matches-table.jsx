import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import MatchForm from "./match-form";
import MatchRow from "./match-row";

export default function MatchesTable({
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
}) {
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
          <TableRow className="bg-muted-foreground/30">
            <TableHead>BUILD</TableHead>
            <TableHead>SLOT 1</TableHead>
            <TableHead>SLOT 2</TableHead>
            <TableHead>SLOT 3</TableHead>
            <TableHead>SLOT 4</TableHead>
            <TableHead>SLOT 5</TableHead>
            <TableHead>LUCK RATE</TableHead>
            <TableHead>TIME (min)</TableHead>
            <TableHead>ENERGY USED</TableHead>
            <TableHead>ENERGY COST</TableHead>
            <TableHead>MAP</TableHead>
            <TableHead>RESULT</TableHead>
            <TableHead>$BFT</TableHead>
            <TableHead>$BFT ($)</TableHead>
            <TableHead>FLEX</TableHead>
            <TableHead>FLEX ($)</TableHead>
            <TableHead>PROFIT</TableHead>
            <TableHead>BFT MULTIPLIER</TableHead>
            <TableHead>PERKS MULTIPLIER</TableHead>
            <TableHead>ACTION(S)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <MatchForm builds={builds} onSubmit={onAdd} />
          {matches.map((match) => (
            <MatchRow
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
