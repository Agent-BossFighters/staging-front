import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Input } from "@ui/input";
import { Check, X, Plus, Pencil, Trash2 } from "lucide-react";
import { useUserPreference } from "@context/userPreference.context";
import { useGameConstants } from "@context/gameConstants.context";
import RaritySelect from "./components/rarity-select";

const maps = ["Toxic river", "Award", "Radiation rift"];
const results = ["win", "loss", "draw"];

const getInitialFormState = (unlockedSlots) => ({
  buildId: "",
  map: "",
  time: "",
  result: "",
  bft: "",
  flex: "",
  rarities: Array(unlockedSlots).fill("none"),
});

function MatchForm({
  match = null,
  builds,
  unlockedSlots,
  onSubmit,
  onCancel,
  mode = "create",
}) {
  const { calculateLuckrate, calculateEnergyUsed } = useUserPreference();
  const { CURRENCY_RATES } = useGameConstants();

  const [formData, setFormData] = useState(() => {
    if (mode === "edit" && match) {
      const currentRarities = Array(unlockedSlots).fill("none");
      match.badge_used?.forEach((badge) => {
        if (badge.slot <= unlockedSlots) {
          currentRarities[badge.slot - 1] = badge.rarity;
        }
      });

      return {
        buildId: builds.find((b) => b.buildName === match.build)?.id || "",
        map: match.map || "",
        time: match.time || "",
        result: match.result || "",
        bft: match.totalToken || "",
        flex: match.totalPremiumCurrency || "",
        rarities: currentRarities,
      };
    }
    return getInitialFormState(unlockedSlots);
  });

  const { buildId, map, time, result, bft, flex, rarities } = formData;

  const energyUsed = calculateEnergyUsed(time);
  const currentLuckrate = calculateLuckrate(
    rarities.filter((r) => r !== "none")
  );

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRarityChange = (index, value) => {
    const newRarities = [...rarities];
    newRarities[index] = value.toLowerCase();
    handleChange("rarities", newRarities);
  };

  const validateForm = () => {
    if (!buildId || !map || !result || !time || !bft) {
      alert(
        "Veuillez remplir tous les champs obligatoires (Build, Map, Résultat, Temps, BFT)"
      );
      return false;
    }

    const selectedBuild = builds.find((b) => b.id === buildId);
    if (!selectedBuild) {
      alert("Build non trouvé");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const selectedBuild = builds.find((b) => b.id === buildId);

    const matchData = {
      match: {
        build: selectedBuild.buildName,
        map: map.toLowerCase(),
        time: parseFloat(time),
        result: result.toLowerCase(),
        totalToken: parseFloat(bft) || 0,
        totalPremiumCurrency: parseFloat(flex) || 0,
        badge_used_attributes: rarities
          .map((rarity, index) => {
            const slot = index + 1;
            // Si on est en mode édition et qu'un badge existe déjà
            if (mode === "edit" && match?.badge_used) {
              const existingBadge = match.badge_used.find(
                (b) => b.slot === slot
              );
              if (existingBadge) {
                return {
                  id: existingBadge.id,
                  slot: slot,
                  rarity: rarity,
                  _destroy: rarity === "none",
                };
              }
            }

            // Pour les nouveaux badges ou en mode création
            if (rarity !== "none") {
              return {
                slot: slot,
                rarity: rarity,
                _destroy: false,
              };
            }

            return null;
          })
          .filter(Boolean),
      },
    };

    console.log("Submitting match data:", matchData);
    onSubmit(matchData);

    if (mode === "create") {
      setFormData(getInitialFormState(unlockedSlots));
    }
  };

  return (
    <tr>
      <td>
        <Select
          value={buildId}
          onValueChange={(value) => handleChange("buildId", value)}
        >
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
      {rarities.map((rarity, index) => (
        <td key={index}>
          <RaritySelect
            value={rarity}
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
      <td>${(energyUsed * CURRENCY_RATES.ENERGY).toFixed(2)}</td>
      <td>
        <Select
          value={map}
          onValueChange={(value) => handleChange("map", value)}
        >
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
        <Select
          value={result}
          onValueChange={(value) => handleChange("result", value)}
        >
          <SelectTrigger className="w-20">
            <SelectValue placeholder="Result" />
          </SelectTrigger>
          <SelectContent>
            {results.map((r) => (
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
      <td>${((bft || 0) * CURRENCY_RATES.BFT).toFixed(2)}</td>
      <td>
        <Input
          type="number"
          className="w-20"
          placeholder="0"
          value={flex}
          onChange={(e) => handleChange("flex", e.target.value)}
        />
      </td>
      <td>${((flex || 0) * CURRENCY_RATES.FLEX).toFixed(2)}</td>
      <td className="text-green-500">
        $
        {(
          (bft || 0) * CURRENCY_RATES.BFT +
          (flex || 0) * CURRENCY_RATES.FLEX -
          energyUsed * CURRENCY_RATES.ENERGY
        ).toFixed(2)}
      </td>
      <td>{builds.find((b) => b.id === buildId)?.bonusMultiplier || "1.0"}</td>
      <td>{builds.find((b) => b.id === buildId)?.perksMultiplier || "1.0"}</td>
      <td className="space-x-2">
        {mode === "create" ? (
          <button
            onClick={handleSubmit}
            className="p-2 hover:bg-yellow-400 rounded-lg"
          >
            <Plus className="h-4 w-4" />
          </button>
        ) : (
          <>
            <button
              onClick={handleSubmit}
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
        )}
      </td>
    </tr>
  );
}

function MatchEntry({
  match,
  builds,
  isEditing,
  onEdit,
  onDelete,
  onUpdate,
  onCancel,
  unlockedSlots,
}) {
  const { CURRENCY_RATES } = useGameConstants();

  if (isEditing) {
    return (
      <MatchForm
        match={match}
        builds={builds}
        unlockedSlots={unlockedSlots}
        onSubmit={onUpdate}
        onCancel={onCancel}
        mode="edit"
      />
    );
  }

  const energyUsed = (parseFloat(match.time) * 0.1).toFixed(2);
  const selectedBuild = builds.find((b) => b.buildName === match.build);

  // Créer un tableau de la taille unlockedSlots rempli de "none"
  const matchRarities = Array(unlockedSlots).fill("none");
  // Remplir avec les badges existants
  if (match.badge_used) {
    match.badge_used.forEach((badge) => {
      if (badge.slot <= unlockedSlots) {
        matchRarities[badge.slot - 1] = badge.rarity;
      }
    });
  }

  return (
    <tr>
      <td>{match.build}</td>
      {matchRarities.map((rarity, index) => {
        const rarityColor =
          rarity === "none"
            ? "#666666"
            : rarity === "common"
              ? "#1ee8b7"
              : rarity === "rare"
                ? "#1e90ff"
                : rarity === "epic"
                  ? "#9b59b6"
                  : rarity === "legendary"
                    ? "#f1c40f"
                    : "#666666";

        return (
          <td key={index} className="text-center">
            <span style={{ color: rarityColor }}>
              {rarity === "none" ? "-" : rarity.charAt(0).toUpperCase()}
            </span>
          </td>
        );
      })}
      <td>{match.luckRate || "0"}</td>
      <td>{match.time}</td>
      <td>{energyUsed}</td>
      <td>${(energyUsed * CURRENCY_RATES.ENERGY).toFixed(2)}</td>
      <td className="capitalize">{match.map}</td>
      <td className="capitalize">{match.result}</td>
      <td>{match.totalToken}</td>
      <td>${(match.totalToken * CURRENCY_RATES.BFT).toFixed(2)}</td>
      <td>{match.totalPremiumCurrency}</td>
      <td>${(match.totalPremiumCurrency * CURRENCY_RATES.FLEX).toFixed(2)}</td>
      <td className="text-green-500">
        $
        {(
          match.totalToken * CURRENCY_RATES.BFT +
          match.totalPremiumCurrency * CURRENCY_RATES.FLEX -
          energyUsed * CURRENCY_RATES.ENERGY
        ).toFixed(2)}
      </td>
      <td>{selectedBuild?.bonusMultiplier || "1.0"}</td>
      <td>{selectedBuild?.perksMultiplier || "1.0"}</td>
      <td className="space-x-2">
        <button
          onClick={() => onEdit(match)}
          className="p-2 hover:bg-yellow-400 rounded-lg"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(match.id)}
          className="p-2 hover:bg-red-400 rounded-lg"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

export default function DailyMatches() {
  const {
    matches,
    builds,
    loading,
    unlockedSlots,
    handleAddMatch,
    handleUpdateMatch,
    handleDeleteMatch,
    initializeData,
  } = useUserPreference();

  const [editingMatchId, setEditingMatchId] = useState(null);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleEdit = (match) => {
    setEditingMatchId(match.id);
  };

  const handleCancel = () => {
    setEditingMatchId(null);
  };

  const renderSlotHeaders = () => {
    return Array.from({ length: unlockedSlots }, (_, i) => (
      <TableHead key={i}>SLOT {i + 1}</TableHead>
    ));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-4 w-48 bg-muted-foreground/30 rounded"></div>
          <div className="h-4 w-36 bg-muted-foreground/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-5">
      <h2 className="text-3xl font-extrabold py-2">MATCHES</h2>
      <Table className="w-full">
        <TableCaption>Daily matches history and statistics</TableCaption>
        <TableHeader>
          <TableRow className="bg-muted-foreground/30">
            <TableHead className="min-w-[120px]">BUILD</TableHead>
            {renderSlotHeaders()}
            <TableHead className="min-w-[80px]">
              LUCK
              <br />
              RATE
            </TableHead>
            <TableHead className="min-w-[80px]">
              TIME
              <br />
              MINUTES
            </TableHead>
            <TableHead className="min-w-[80px]">
              ENERGY
              <br />
              USED
            </TableHead>
            <TableHead className="min-w-[80px] text-destructive">
              ENERGY
              <br />
              COST
            </TableHead>
            <TableHead className="min-w-[100px]">MAP</TableHead>
            <TableHead className="min-w-[80px]">RESULT</TableHead>
            <TableHead className="min-w-[80px]">BFT</TableHead>
            <TableHead className="min-w-[80px] text-accent">
              BFT
              <br />
              VALUE
            </TableHead>
            <TableHead className="min-w-[80px]">FLEX</TableHead>
            <TableHead className="min-w-[80px] text-accent">
              FLEX
              <br />
              VALUE
            </TableHead>
            <TableHead className="min-w-[80px] text-green-500">
              PROFIT
            </TableHead>
            <TableHead className="min-w-[80px]">
              BFT
              <br />
              MULTIPLIER
            </TableHead>
            <TableHead className="min-w-[80px]">
              PERKS
              <br />
              MULTIPLIER
            </TableHead>
            <TableHead className="min-w-[100px]">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto">
          <MatchForm
            builds={builds}
            onSubmit={handleAddMatch}
            unlockedSlots={unlockedSlots}
            mode="create"
          />
          {matches.map((match) => (
            <MatchEntry
              key={match.id}
              match={match}
              builds={builds}
              isEditing={match.id === editingMatchId}
              onEdit={handleEdit}
              onDelete={handleDeleteMatch}
              onUpdate={(data) => handleUpdateMatch(match.id, data)}
              onCancel={handleCancel}
              unlockedSlots={unlockedSlots}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
