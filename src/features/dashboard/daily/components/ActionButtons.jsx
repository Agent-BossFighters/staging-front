import { Check, X, Plus, Pencil, Trash2 } from "lucide-react";

export function DisplayActions({ onEdit, onDelete }) {
  return (
    <>
      <button
        onClick={onEdit}
        className="p-2 hover:bg-yellow-400 rounded-lg"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        onClick={onDelete}
        className="p-2 hover:bg-red-400 rounded-lg"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </>
  );
}

export function EditActions({ onSubmit, onCancel }) {
  return (
    <>
      <button
        onClick={onSubmit}
        className="p-2 hover:bg-green-400 rounded-lg"
      >
        <Check className="h-4 w-4" />
      </button>
      <button
        onClick={onCancel}
        className="p-2 hover:bg-red-400 rounded-lg"
      >
        <X className="h-4 w-4" />
      </button>
    </>
  );
}

export function CreateAction({ onSubmit }) {
  return (
    <button
      onClick={onSubmit}
      className="p-4 hover:bg-yellow-400 rounded-lg"
    >
      <Plus className="h-4 w-4" />
    </button>
  );
}

export default function ActionButtons({ isEditing, isCreating, onEdit, onDelete, onSubmit, onCancel }) {
  if (isCreating) {
    return <CreateAction onSubmit={onSubmit} />;
  }

  if (isEditing) {
    return <EditActions onSubmit={onSubmit} onCancel={onCancel} />;
  }

  return <DisplayActions onEdit={onEdit} onDelete={onDelete} />;
}
