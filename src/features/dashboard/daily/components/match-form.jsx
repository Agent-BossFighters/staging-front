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

export default function MatchForm({ builds, onSubmit, initialData = null }) {
  const { calculateLuckrate, calculateEnergyUsed } = useMatchCalculations();
  const [buildId, setBuildId] = useState(initialData?.buildId || "");
  const [map, setMap] = useState(initialData?.map || "");
  const [time, setTime] = useState(initialData?.time || "");
  const [result, setResult] = useState(initialData?.result || "");
  const [bft, setBft] = useState(initialData?.totalToken || "");
  const [flex, setFlex] = useState(initialData?.totalPremiumCurrency || "");
  const [rarities, setRarities] = useState(
    initialData?.selectedRarities || Array(5).fill("rare")
  );

  const energyUsed = calculateEnergyUsed(time);
  const currentLuckrate = calculateLuckrate(rarities);

  const handleSubmit = () => {
    if (!buildId || !map || !result || !time || !bft) {
      alert(
        "Veuillez remplir tous les champs obligatoires (Build, Map, Résultat, Temps, BFT)"
      );
      return;
    }

    const selectedBuild = builds.find((b) => b.id === buildId);
    if (!selectedBuild) {
      alert("Build non trouvé");
      return;
    }

    // S'assurer que les raretés sont en minuscules pour le serveur
    const badges = rarities.map((rarity, index) => ({
      slot: index + 1,
      rarity: rarity.toLowerCase(),
      _destroy: false,
    }));

    const matchData = {
      match: {
        date: new Date().toISOString(),
        build: selectedBuild.buildName,
        map: map,
        time: time,
        result: result,
        totalToken: bft || 0,
        totalPremiumCurrency: flex || 0,
        badge_used_attributes: badges,
      },
    };

    onSubmit(matchData);

    if (!initialData) {
      // Reset form only if it's a new match
      setBuildId("");
      setMap("");
      setTime("");
      setResult("");
      setBft("");
      setFlex("");
      setRarities(Array(5).fill("rare"));
    }
  };

  return (
    <tr>
      <td>
        <Select value={buildId} onValueChange={setBuildId}>
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
            onChange={(value) => {
              const newRarities = [...rarities];
              newRarities[index] = value.toLowerCase();
              setRarities(newRarities);
            }}
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
          onChange={(e) => setTime(e.target.value)}
        />
      </td>
      <td>{energyUsed || "0.00"}</td>
      <td>${(energyUsed * 1.49).toFixed(2)}</td>
      <td>
        <Select value={map} onValueChange={setMap}>
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
        <Select value={result} onValueChange={setResult}>
          <SelectTrigger className="w-20">
            <SelectValue placeholder="Result" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="win">Win</SelectItem>
            <SelectItem value="loss">Loss</SelectItem>
            <SelectItem value="draw">Draw</SelectItem>
          </SelectContent>
        </Select>
      </td>
      <td>
        <Input
          type="number"
          className="w-20"
          placeholder="0"
          value={bft}
          onChange={(e) => setBft(e.target.value)}
        />
      </td>
      <td>${((bft || 0) * 0.01).toFixed(2)}</td>
      <td>
        <Input
          type="number"
          className="w-20"
          placeholder="0"
          value={flex}
          onChange={(e) => setFlex(e.target.value)}
        />
      </td>
      <td>${((flex || 0) * 0.00744).toFixed(2)}</td>
      <td className="text-green-500">
        $
        {(
          (bft || 0) * 0.01 +
          (flex || 0) * 0.00744 -
          energyUsed * 1.49
        ).toFixed(2)}
      </td>
      <td>{builds.find((b) => b.id === buildId)?.bonusMultiplier || "1.0"}</td>
      <td>{builds.find((b) => b.id === buildId)?.perksMultiplier || "1.0"}</td>
      <td>
        <button
          onClick={handleSubmit}
          className="p-2 hover:bg-yellow-400 rounded-lg"
        >
          <Plus className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}
