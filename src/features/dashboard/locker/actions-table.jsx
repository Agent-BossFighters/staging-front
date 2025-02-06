import { Button } from "@ui/button";
import { Pencil, Trash2, Check, X } from "lucide-react";

export default function ActionsTable({
  contract,
  onEdit,
  onDelete,
  isEditing,
  onSave,
  onCancel,
}) {
  return (
    <>
      {!isEditing ? (
        <Button
          variant="transparent"
          className="p-0 hover:text-primary hover:scale-150"
          onClick={() => onEdit(contract)}
        >
          <Pencil />
        </Button>
      ) : (
        <>
          <Button
            variant="transparent"
            className="p-0 hover:text-primary hover:scale-150"
            onClick={onSave}
          >
            <Check />
          </Button>
          <Button
            variant="transparent"
            className="p-0 hover:text-primary hover:scale-150"
            onClick={onCancel}
          >
            <X />
          </Button>
        </>
      )}
      <Button
        variant="transparent"
        className="p-0 hover:text-primary hover:scale-150"
        onClick={onDelete}
      >
        <Trash2 />
      </Button>
    </>
  );
}
