import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Input } from "@ui/input";
import RaritySelect from "./rarity-select";
import { useDaily } from "../hooks/useDaily";
import RarityBadge from "./RarityBadge";
import MapIcon, { GAME_MAPS, MapSelectItem } from "./MapIcon";
import ResultIcon, { GAME_RESULTS, ResultSelectItem } from "./ResultIcon";
import ActionButtons from "./ActionButtons";

const MAX_SLOTS = 5; // Nombre maximum de slots possible
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
  const {
    calculateEnergyUsed,
    calculateEnergyCost,
    calculateTokenValue,
    calculatePremiumValue,
    calculateLuckrate,
    calculateProfit,
  } = useDaily();

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
    if (!data.buildId || !data.map || !data.result || !data.time || !data.bft) {
      alert(
        "Please fill in all required fields (Build, Map, Result, Time, BFT)"
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
        energyUsed: parseFloat(calculateEnergyUsed(time)),
        result: result,
        totalToken: totalToken,
        totalPremiumCurrency: totalPremiumCurrency,
        badge_used_attributes: data.rarities
          .map((rarity, index) => {
            const slot = index + 1;
            if (existingMatch?.badge_used) {
              const existingBadge = existingMatch.badge_used.find(
                (b) => b.slot === slot
              );
              if (existingBadge) {
                return {
                  id: existingBadge.id,
                  slot: slot,
                  rarity: String(rarity || "").toLowerCase(),
                  _destroy: rarity === "none",
                };
              }
            }

            if (rarity && rarity !== "none") {
              return {
                slot: slot,
                rarity: String(rarity).toLowerCase(),
                _destroy: false,
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
      onUpdate(matchData)
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

  // Mode affichage
  if (!isEditing && !isCreating) {
    const currentBuild = builds.find((b) => b.buildName === match.build);
    const energyUsed = calculateEnergyUsed(match.time);
    const matchRarities = Array(MAX_SLOTS)
      .fill("none")
      .map((_, index) => {
        const badge = match.badge_used?.find((b) => b.slot === index + 1);
        return badge ? badge.rarity : "none";
      });

    return (
      <tr>
        <td className="min-w-[120px]">
          <span className="font-medium">{match.build}</span>
        </td>
        {matchRarities.map((rarity, index) => (
          <td key={index} className="text-center min-w-[60px]">
            <RarityBadge rarity={rarity} />
          </td>
        ))}
        <td className="text-center min-w-[80px]">
          {calculateLuckrate(matchRarities)}
        </td>
        <td className="text-center min-w-[80px]">{match.time}</td>
        <td className="text-center min-w-[80px]">{energyUsed}</td>
        <td className="text-center min-w-[80px] text-destructive">
          ${calculateEnergyCost(energyUsed)}
        </td>
        <td className="text-center min-w-[100px] capitalize">
          <MapIcon map={match.map} />
        </td>
        <td className="text-center min-w-[80px] capitalize">
          <ResultIcon result={match.result} />
        </td>
        <td className="text-center min-w-[80px]">{match.totalToken}</td>
        <td className="text-center min-w-[80px] text-accent">
          ${calculateTokenValue(match.totalToken)}
        </td>
        <td className="text-center min-w-[80px]">
          {match.totalPremiumCurrency}
        </td>
        <td className="text-center min-w-[80px] text-accent">
          ${calculatePremiumValue(match.totalPremiumCurrency)}
        </td>
        <td className="text-center min-w-[80px] text-green-500">
          ${calculateProfit(match)}
        </td>
        <td className="text-center min-w-[80px]">
          {parseFloat(currentBuild?.bonusMultiplier || 1).toFixed(1)}
        </td>
        <td className="text-center min-w-[80px]">
          {parseFloat(currentBuild?.perksMultiplier || 1).toFixed(1)}
        </td>
        <td className="flex gap-2 items-center justify-center min-w-[100px]">
          <ActionButtons
            isEditing={isEditing}
            isCreating={isCreating}
            onEdit={() => onEdit(match)}
            onDelete={() => onDelete(match.id)}
            onSubmit={handleSubmit}
            onCancel={onCancel}
          />
        </td>
      </tr>
    );
  }

  // Mode édition ou création
  const data = isCreating ? formData : editedData;
  const energyUsed = calculateEnergyUsed(data.time);

  return (
    <tr>
      <td className="min-w-[120px]">
        <Select
          value={data.buildId}
          onValueChange={(value) => handleChange("buildId", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {builds.map((build) => (
              <SelectItem key={build.id} value={build.id}>
                {build.buildName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      {Array(MAX_SLOTS)
        .fill(null)
        .map((_, index) => (
          <td key={index} className="min-w-[60px]">
            {index >= unlockedSlots ? (
              <RarityBadge rarity="none" />
            ) : (
              <RaritySelect
                value={data.rarities[index]}
                onChange={(value) => handleRarityChange(index, value)}
                disabled={index >= unlockedSlots}
              />
            )}
          </td>
        ))}
      <td className="text-center min-w-[80px]">
        {calculateLuckrate(data.rarities)}
      </td>
      <td className="min-w-[80px]">
        <Input
          type="number"
          className="w-20"
          placeholder="0"
          value={data.time}
          onChange={(e) => handleChange("time", e.target.value)}
        />
      </td>
      <td className="text-center min-w-[80px]">{energyUsed}</td>
      <td className="text-center min-w-[80px] text-destructive">
        ${calculateEnergyCost(energyUsed)}
      </td>
      <td className="min-w-[100px]">
        <Select
          value={data.map}
          onValueChange={(value) => handleChange("map", value)}
        >
          <SelectTrigger className="w-20 h-8 px-2">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(GAME_MAPS).map(([map, mapData]) => (
              <SelectItem key={map} value={map}>
                <MapSelectItem map={map} mapData={mapData} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="min-w-[80px]">
        <Select
          value={data.result}
          onValueChange={(value) => handleChange("result", value)}
        >
          <SelectTrigger className="w-20 h-8 px-2">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(GAME_RESULTS).map(([result, resultData]) => (
              <SelectItem key={result} value={result}>
                <ResultSelectItem result={result} resultData={resultData} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="min-w-[80px]">
        <Input
          type="number"
          className="w-20"
          placeholder="0"
          value={data.bft}
          onChange={(e) => handleChange("bft", e.target.value)}
        />
      </td>
      <td className="text-center min-w-[80px] text-accent">
        ${calculateTokenValue(data.bft)}
      </td>
      <td className="min-w-[80px]">
        <Input
          type="number"
          className="w-20"
          placeholder="0"
          value={data.flex}
          onChange={(e) => handleChange("flex", e.target.value)}
        />
      </td>
      <td className="text-center min-w-[80px] text-accent">
        ${calculatePremiumValue(data.flex)}
      </td>
      <td className="text-center min-w-[80px] text-green-500">
        $
        {calculateProfit({
          time: data.time,
          totalToken: data.bft,
          totalPremiumCurrency: data.flex,
          build: builds.find((b) => b.id === data.buildId),
        })}
      </td>
      <td className="text-center min-w-[80px]">
        {parseFloat(
          builds.find((b) => b.id === data.buildId)?.bonusMultiplier || 1
        ).toFixed(1)}
      </td>
      <td className="text-center min-w-[80px]">
        {parseFloat(
          builds.find((b) => b.id === data.buildId)?.perksMultiplier || 1
        ).toFixed(1)}
      </td>
      <td className="flex gap-2 items-center justify-center min-w-[100px]">
        <ActionButtons
          isEditing={isEditing}
          isCreating={isCreating}
          onEdit={() => onEdit(match)}
          onDelete={() => onDelete(match?.id)}
          onSubmit={handleSubmit}
          onCancel={onCancel}
        />
      </td>
    </tr>
  );
}
