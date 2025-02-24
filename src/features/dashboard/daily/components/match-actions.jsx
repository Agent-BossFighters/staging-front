import { Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@ui/button";

export default function MatchActions({
  data,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  isEditing,
}) {
  if (isEditing) {
    return (
      <>
        <Button
          variant="transparent"
          onClick={onSave}
          className="p-0 hover:text-green-500 hover:scale-150"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="transparent"
          onClick={onCancel}
          className="p-0 hover:text-red-500 hover:scale-150"
        >
          <X className="h-4 w-4" />
        </Button>
      </>
    );
  }

  return (
    <>
      <Button
        variant="transparent"
        onClick={() => onEdit(data)}
        className="p-0 hover:text-primary hover:scale-150"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="transparent"
        onClick={() => onDelete(data)}
        className="p-0 hover:text-red-500 hover:scale-150"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );
}
