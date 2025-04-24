import { ConfirmDialog } from "@shared/ui/dialog";

export function MatchDialogs({
  showMissingFieldsDialog,
  setShowMissingFieldsDialog,
  missingFieldsList,
  showCreateWarningDialog,
  setShowCreateWarningDialog,
  onCreateConfirm,
  showEditTimeoutDialog,
  setShowEditTimeoutDialog,
  onTimeoutConfirm,
}) {
  // Textes localisés
  const texts = {
    en: {
      missingFields: {
        title: "Missing Fields",
        message: `Please fill in the following fields: ${missingFieldsList?.join(", ")}`,
        confirm: "OK"
      },
      createWarning: {
        title: "Warning",
        message: "WARNING: You will only be able to modify this match within the next 15 minutes. Please ensure all information is correct.",
        confirm: "Confirm",
        cancel: "Cancel"
      },
      editTimeout: {
        title: "Edit not possible",
        message: "This match cannot be edited because it was created more than 15 minutes ago.",
        confirm: "I understand"
      }
    },
  };

  const t = texts.en;

  return (
    <>
      {/* Dialogue pour champs manquants */}
      <ConfirmDialog
        isOpen={showMissingFieldsDialog}
        onClose={() => setShowMissingFieldsDialog(false)}
        onConfirm={() => setShowMissingFieldsDialog(false)}
        title={t.missingFields.title}
        message={t.missingFields.message}
        confirmText={t.missingFields.confirm}
        cancelText={null}
      />

      {/* Dialogue d'avertissement de création */}
      <ConfirmDialog
        isOpen={showCreateWarningDialog}
        onClose={() => setShowCreateWarningDialog(false)}
        onConfirm={() => {
          setShowCreateWarningDialog(false);
          onCreateConfirm();
        }}
        title={t.createWarning.title}
        message={t.createWarning.message}
        confirmText={t.createWarning.confirm}
        cancelText={t.createWarning.cancel}
      />

      {/* Dialogue de limite de temps d'édition */}
      <ConfirmDialog
        isOpen={showEditTimeoutDialog}
        onClose={() => {
          setShowEditTimeoutDialog(false);
          onTimeoutConfirm();
        }}
        onConfirm={() => {
          setShowEditTimeoutDialog(false);
          onTimeoutConfirm();
        }}
        title={t.editTimeout.title}
        message={t.editTimeout.message}
        confirmText={t.editTimeout.confirm}
        cancelText={t.editTimeout.confirm}
      />
    </>
  );
} 