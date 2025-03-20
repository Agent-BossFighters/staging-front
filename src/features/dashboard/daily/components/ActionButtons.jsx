import { Check, X, Plus, Pencil, Trash2 } from "lucide-react";

export function DisplayActions({ onEdit, onDelete, editDisabled }) {
  return (
    <>
      <button
        onClick={onEdit}
        className="p-2"
        disabled={editDisabled}
        style={editDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
      >
        <Pencil className="font-size-bold h-6 w-6 hover:text-yellow-400" />
      </button>
      <button
        onClick={onDelete}
        className="p-2"
      >
        <Trash2 className="font-size-bold h-6 w-6 hover:text-red-400" />
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
      className="p-2"
    >
      <Plus className="font-size-bold h-7 w-7 hover:text-yellow-400" />
    </button>
  );
}

export default function ActionButtons({ isEditing, isCreating, onEdit, onDelete, onSubmit, onCancel, editDisabled }) {
  if (isCreating) {
    return <CreateAction onSubmit={onSubmit} />;
  }

  if (isEditing) {
    return <EditActions onSubmit={onSubmit} onCancel={onCancel} />;
  }

  return <DisplayActions onEdit={onEdit} onDelete={onDelete} editDisabled={editDisabled} />;
}
