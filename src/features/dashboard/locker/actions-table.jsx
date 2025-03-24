import { Button } from "@ui/button";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@shared/ui/dialog";

export default function ActionsTable({
  data,
  onEdit,
  onDelete,
  isEditing,
  onSave,
  onCancel,
  itemName = "this item"
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      {!isEditing ? (
        <>
          <Button
            variant="transparent"
            className="p-0 hover:text-primary hover:scale-150"
            onClick={() => onEdit(data)}
          >
            <Pencil />
          </Button>
          <Button
            variant="transparent"
            className="p-0 hover:text-destructive hover:scale-150"
            onClick={() => setIsConfirmOpen(true)}
          >
            <Trash2 />
          </Button>
          
          <ConfirmDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={onDelete}
            title="Confirm Delete"
            message={`Are you sure you want to delete ${itemName}?`}
            confirmText="Delete"
            cancelText="Cancel"
            isDanger={true}
          />
        </>
      ) : (
        <>
          <Button
            variant="transparent"
            className="p-0 hover:text-accent hover:scale-150"
            onClick={onSave}
          >
            <Check />
          </Button>
          <Button
            variant="transparent"
            className="p-0 hover:text-destructive hover:scale-150"
            onClick={onCancel}
          >
            <X />
          </Button>
        </>
      )}
    </>
  );
}
