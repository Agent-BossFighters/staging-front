import { Button } from "@ui/button";
import { Pencil, Trash2, Check, X } from "lucide-react";

export default function ActionsTable({
  data,
  onEdit,
  onDelete,
  isEditing,
  onSave,
  onCancel,
}) {
  return (
    <>
      {!isEditing ? (
        <>
          <Button variant="ghost" size="icon" onClick={() => onEdit(data)}>
            <Pencil className="text-primary" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="text-destructive" />
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" size="icon" onClick={onSave}>
            <Check className="text-accent" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="text-destructive" />
          </Button>
        </>
      )}
    </>
  );
}
