import { useState } from "react";
import MatchDisplayRow from "./MatchDisplayRow";
import MatchFormRow from "./MatchFormRow";

const MAX_SLOTS = 5;
const INITIAL_FORM_STATE = {
  buildId: "",
  map: "",
  time: "",
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
}) {
  const [formData, setFormData] = useState(() => ({
    ...INITIAL_FORM_STATE,
    rarities: Array(MAX_SLOTS).fill("none"),
  }));

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
    if (!data.time) missingFields.push("Time");
    if (!data.bft) missingFields.push("BFT");

    if (missingFields.length > 0) {
      alert(
        `Missing fields: ${missingFields.join(", ")}. Please fill all fields.`
      );
      return false;
    }

    const selectedBuild = builds.find((b) => b.id === data.buildId);
    if (!selectedBuild) {
      alert("Build not found");
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

    if (!data.map || !data.result || !data.time || !data.bft) {
      throw new Error("Tous les champs obligatoires doivent être remplis");
    }

    const time = parseInt(data.time);
    const totalToken = parseInt(data.bft);
    const totalPremiumCurrency = parseInt(data.flex || 0);

    if (isNaN(time) || time < 0) {
      throw new Error("Le temps doit être un nombre positif");
    }

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

    return {
      match: {
        id: existingMatch?.id,
        build: selectedBuild.buildName,
        map: map,
        time: time,
        result: result,
        totalToken: totalToken,
        totalPremiumCurrency: totalPremiumCurrency,
        bonusMultiplier: parseFloat(selectedBuild.bonusMultiplier),
        perksMultiplier: parseFloat(selectedBuild.perksMultiplier),
        energyUsed: parseFloat((time / 10.0).toFixed(2)),
        badge_used_attributes: data.rarities
          .map((rarity, index) => {
            const slot = index + 1;
            
            if (existingMatch?.badge_used) {
              const existingBadge = existingMatch.badge_used.find(
                (b) => b.slot === slot
              );
              
              if (existingBadge) {
                const newRarity = rarity === "none" ? null : String(rarity).split("#")[0].toLowerCase();
                
                if (rarity === "none") {
                  console.log(`Marquage du badge slot ${slot} pour suppression`);
                  return {
                    id: existingBadge.id,
                    slot: slot,
                    _destroy: true
                  };
                }
                else if (newRarity !== existingBadge.rarity) {
                  console.log(`Mise à jour du badge slot ${slot} de ${existingBadge.rarity} à ${newRarity}`);
                  return {
                    id: existingBadge.id,
                    slot: slot,
                    rarity: newRarity,
                    _destroy: false
                  };
                }
                else {
                  console.log(`Pas de changement pour le badge slot ${slot}`);
                  return {
                    id: existingBadge.id,
                    slot: slot,
                    rarity: existingBadge.rarity,
                    _destroy: false
                  };
                }
              }
            }
            
            if (rarity && rarity !== "none") {
              return {
                slot: slot,
                rarity: String(rarity).split("#")[0].toLowerCase(),
                _destroy: false
              };
            }
            return null;
          })
          .filter(Boolean),
      },
    };
  };

  const handleSubmit = () => {
    const data = isCreating ? formData : editedData;
    if (!validateForm(data)) return;

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

  if (!isEditing && !isCreating) {
    return (
      <MatchDisplayRow
        match={match}
        builds={builds}
        isEditing={isEditing}
        isCreating={isCreating}
        onEdit={onEdit}
        onDelete={onDelete}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    );
  }

  return (
    <MatchFormRow
      data={isCreating ? formData : editedData}
      builds={builds}
      isEditing={isEditing}
      isCreating={isCreating}
      unlockedSlots={unlockedSlots}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      onChange={handleChange}
      onRarityChange={handleRarityChange}
    />
  );
}
