import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Input } from "@ui/input";
import { Plus } from "lucide-react";
import { useMatchCalculations } from "../hook/useMatchCalculations";
import RaritySelect from "./rarity-select";

const maps = ["Toxic river", "Award", "Radiation rift"];
const results = ["win", "loss", "draw"];

const initialFormState = {
  buildId: "",
  map: "",
  time: "",
  result: "",
  bft: "",
  flex: "",
  rarities: Array(5).fill("rare"),
};

export default function MatchForm({ builds, onSubmit }) {
  const { calculateLuckrate, calculateEnergyUsed } = useMatchCalculations();
  const [formData, setFormData] = useState(initialFormState);
  const { buildId, map, time, result, bft, flex, rarities } = formData;

  const energyUsed = calculateEnergyUsed(time);
  const currentLuckrate = calculateLuckrate(rarities);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRarityChange = (index, value) => {
    const newRarities = [...rarities];
    newRarities[index] = value.toLowerCase();
    handleChange("rarities", newRarities);
  };

  const handleSubmit = () => {
    if (!buildId || !map || !result || !time || !bft) {
      alert("Veuillez remplir tous les champs obligatoires (Build, Map, Résultat, Temps, BFT)");
      return;
    }

    const selectedBuild = builds.find(b => b.id === buildId);
    if (!selectedBuild) {
      alert("Build non trouvé");
      return;
    }

    const matchData = {
      match: {
        date: new Date().toISOString(),
        build: selectedBuild.buildName,
        map,
        time,
        result,
        totalToken: bft || 0,
        totalPremiumCurrency: flex || 0,
        badge_used_attributes: rarities.map((rarity, index) => ({
          slot: index + 1,
          rarity: rarity.toLowerCase(),
          _destroy: false,
        })),
      },
    };

    onSubmit(matchData);
    setFormData(initialFormState);
  };

  return (
    <tr>
      <td>
        <Select value={buildId} onValueChange={(value) => handleChange("buildId", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select build" />
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
      {[...Array(5)].map((_, index) => (
        <td key={index}>
          <RaritySelect
            value={rarities[index]}
            onChange={(value) => handleRarityChange(index, value)}
          />
        </td>
      ))}
      <td>{currentLuckrate}</td>
      <td>
        <Input
          type="number"
          className="w-20"
          placeholder="0"
          value={time}
          onChange={(e) => handleChange("time", e.target.value)}
        />
      </td>
      <td>{energyUsed || "0.00"}</td>
      <td>${(energyUsed * 1.49).toFixed(2)}</td>
      <td>
        <Select value={map} onValueChange={(value) => handleChange("map", value)}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Select map" />
          </SelectTrigger>
          <SelectContent>
            {maps.map((m) => (
              <SelectItem key={m} value={m.toLowerCase()}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td>
        <Select value={result} onValueChange={(value) => handleChange("result", value)}>
          <SelectTrigger className="w-20">
            <SelectValue placeholder="Result" />
          </SelectTrigger>
          <SelectContent>
            {results.map(r => (
              <SelectItem key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td>
        <Input
          type="number"
          className="w-20"
          placeholder="0"
          value={bft}
          onChange={(e) => handleChange("bft", e.target.value)}
        />
      </td>
      <td>${((bft || 0) * 0.01).toFixed(2)}</td>
      <td>
        <Input
          type="number"
          className="w-20"
          placeholder="0"
          value={flex}
          onChange={(e) => handleChange("flex", e.target.value)}
        />
      </td>
      <td>${((flex || 0) * 0.00744).toFixed(2)}</td>
      <td className="text-green-500">
        ${((bft || 0) * 0.01 + (flex || 0) * 0.00744 - energyUsed * 1.49).toFixed(2)}
      </td>
      <td>{builds.find(b => b.id === buildId)?.bonusMultiplier || "1.0"}</td>
      <td>{builds.find(b => b.id === buildId)?.perksMultiplier || "1.0"}</td>
      <td>
        <button onClick={handleSubmit} className="p-2 hover:bg-yellow-400 rounded-lg">
          <Plus className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}
