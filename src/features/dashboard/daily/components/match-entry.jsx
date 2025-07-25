import { useState } from "react";
import MatchDisplayRow from "./MatchDisplayRow";
import MatchFormRow from "./MatchFormRow";
import { MatchDialogs } from "./MatchDialogs";

const MAX_SLOTS = 5;
const INITIAL_FORM_STATE = {
  buildId: "",
  map: "",
  energyUsed: "",
  energyCost: "",
  result: "",
  bft: "",
  flex: "",
  rarities: [],
};

export default function MatchEntry({
  match,
  builds,
  isEditing,
  isCreating,
  editedData,
  onEdit,
  onDelete,
  onUpdate,
  onSubmit,
  onEditField,
  onCancel,
  unlockedSlots,
  selectedDate,
  initialMatchData,
}) {
  const [formData, setFormData] = useState(() => {
    const initialData = {
      ...INITIAL_FORM_STATE,
      ...(isCreating && initialMatchData ? initialMatchData : {}),
      rarities:
        isCreating && initialMatchData?.rarities
          ? initialMatchData.rarities
          : Array(MAX_SLOTS).fill("none"),
    };
    return initialData;
  });
  const [showMissingFieldsDialog, setShowMissingFieldsDialog] = useState(false);
  const [missingFieldsList, setMissingFieldsList] = useState([]);
  const [showCreateWarningDialog, setShowCreateWarningDialog] = useState(false);
  const [showEditTimeoutDialog, setShowEditTimeoutDialog] = useState(false);

  const handleChange = (field, value) => {
    if (isCreating) {
      setFormData((prev) => ({ ...prev, [field]: value }));
    } else if (isEditing) {
      onEditField(field, value);
    }
  };

  const handleRarityChange = (index, value) => {
    if (isCreating && index >= unlockedSlots) return;

    const newRarities = isCreating
      ? [...formData.rarities]
      : [...editedData.rarities];
    newRarities[index] = value.toLowerCase();
    handleChange("rarities", newRarities);
  };

  const validateForm = (data) => {
    const missingFields = [];
    if (!data.buildId) missingFields.push("Build Name");
    if (!data.map) missingFields.push("Map");
    if (!data.result) missingFields.push("Result");
    if (!data.bft) missingFields.push("BFT");
    if (!data.energyUsed) missingFields.push("Energy Used");
    if (!data.energyCost) missingFields.push("Energy Cost");

    if (missingFields.length > 0) {
      setMissingFieldsList(missingFields);
      setShowMissingFieldsDialog(true);
      return false;
    }

    const selectedBuild = builds.find((b) => b.id === data.buildId);
    if (!selectedBuild) {
      setMissingFieldsList(["Build not found"]);
      setShowMissingFieldsDialog(true);
      return false;
    }

    return true;
  };

  const formatMapName = (mapName) => {
    return mapName.toLowerCase().replace(/\s+/g, "_");
  };

  const createMatchData = (data, existingMatch = null) => {
    const selectedBuild = builds.find((b) => b.id === data.buildId);
    if (!selectedBuild) return null;

    if (!data.map || !data.result || !data.bft || !data.energyUsed || !data.energyCost) {
      throw new Error("Tous les champs obligatoires doivent être remplis");
    }

    const totalToken = parseFloat(parseFloat(data.bft).toFixed(3));
    const totalPremiumCurrency = parseInt(data.flex || 0);


    if (isNaN(totalToken) || totalToken < 0) {
      throw new Error("Le total de tokens doit être un nombre positif");
    }

    if (isNaN(totalPremiumCurrency) || totalPremiumCurrency < 0) {
      throw new Error(
        "Le total de premium currency doit être un nombre positif"
      );
    }

    const validMaps = ["toxic_river", "award", "radiation_rift"];
    const validResults = ["win", "loss", "draw"];
    const map = formatMapName(String(data.map || ""));
    const result = String(data.result || "").toLowerCase();

    if (!validMaps.includes(map)) {
      throw new Error(
        `Map invalide '${data.map}'. Valeurs acceptées : ${validMaps.join(", ")}`
      );
    }

    if (!validResults.includes(result)) {
      throw new Error(
        `Résultat invalide '${data.result}'. Valeurs acceptées : ${validResults.join(
          ", "
        )}`
      );
    }

    const badge_used = data.rarities.filter(
      (rarity) => rarity && rarity !== "none"
    );

    return {
      match: {
        id: existingMatch?.id,
        build: selectedBuild.buildName,
        map: map,
        result: result,
        totalToken: totalToken,
        totalPremiumCurrency: totalPremiumCurrency,
        bonusMultiplier: parseFloat(selectedBuild.bonusMultiplier),
        perksMultiplier: parseFloat(selectedBuild.perksMultiplier),
        energyUsed: parseFloat(data.energyUsed),
        energyCost: parseFloat(data.energyCost),
        badge_used_attributes: data.rarities
          .map((rarity, index) => {
            const slot = index + 1;

            if (existingMatch?.badge_used) {
              const existingBadge = existingMatch.badge_used.find(
                (b) => b.slot === slot
              );

              if (existingBadge) {
                const newRarity =
                  rarity === "none"
                    ? null
                    : String(rarity).split("#")[0].toLowerCase();

                if (rarity === "none") {
                  return {
                    id: existingBadge.id,
                    slot: slot,
                    _destroy: true,
                  };
                } else if (newRarity !== existingBadge.rarity) {
                  return {
                    id: existingBadge.id,
                    slot: slot,
                    rarity: newRarity,
                    _destroy: false,
                  };
                } else {
                  return {
                    id: existingBadge.id,
                    slot: slot,
                    rarity: existingBadge.rarity,
                    _destroy: false,
                  };
                }
              }
            }

            if (rarity && rarity !== "none") {
              return {
                slot: slot,
                rarity: String(rarity).split("#")[0].toLowerCase(),
                _destroy: false,
              };
            }
            return null;
          })
          .filter(Boolean),
      },
    };
  };

  const prepareAndSubmit = () => {
    const data = isCreating ? formData : editedData;
    const matchData = createMatchData(data, isEditing ? match : null);
    console.log("Payload envoyé :", JSON.stringify(matchData, null, 2));

    if (isCreating) {
      onSubmit(matchData)
        .then(() => {
          setFormData({
            ...INITIAL_FORM_STATE,
            rarities: Array(MAX_SLOTS).fill("none"),
          });
        })
        .catch((error) => {
          console.error("Erreur détaillée:", error);
          if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Headers:", error.response.headers);
            console.error("Data:", error.response.data);
          }
        });
    } else {
      onUpdate(matchData.match)
        .then(() => {
          onCancel();
        })
        .catch((error) => {
          console.error("Erreur détaillée:", error);
          if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Headers:", error.response.headers);
            console.error("Data:", error.response.data);
          }
        });
    }
  };

  const handleSubmit = () => {
    const data = isCreating ? formData : editedData;
    if (!validateForm(data)) return;

    if (isCreating) {
      setShowCreateWarningDialog(true);
      return;
    }

    if (isEditing && match) {
      const creationTime = new Date(match.created_at || match.date);
      const currentTime = new Date();
      const timeDifferenceInMinutes =
        (currentTime - creationTime) / (1000 * 60);

      if (timeDifferenceInMinutes > 15) {
        setShowEditTimeoutDialog(true);
        return;
      }
    }

    // Si toutes les validations sont passées, soumettre le formulaire
    prepareAndSubmit();
  };

  if (!isEditing && !isCreating) {
    return (
      <MatchDisplayRow
        match={match}
        builds={builds}
        isEditing={isEditing}
        onEdit={onEdit}
        onDelete={onDelete}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    );
  }

  return (
    <>
      <MatchFormRow
        data={isEditing ? editedData : formData}
        builds={builds}
        isEditing={isEditing}
        isCreating={isCreating}
        unlockedSlots={unlockedSlots}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        onChange={handleChange}
        onRarityChange={handleRarityChange}
        selectedDate={selectedDate}
      />
      <MatchDialogs
        showMissingFieldsDialog={showMissingFieldsDialog}
        setShowMissingFieldsDialog={setShowMissingFieldsDialog}
        missingFieldsList={missingFieldsList}
        showCreateWarningDialog={showCreateWarningDialog}
        setShowCreateWarningDialog={setShowCreateWarningDialog}
        onCreateConfirm={prepareAndSubmit}
        showEditTimeoutDialog={showEditTimeoutDialog}
        setShowEditTimeoutDialog={setShowEditTimeoutDialog}
        onTimeoutConfirm={onCancel}
      />
    </>
  );
}
