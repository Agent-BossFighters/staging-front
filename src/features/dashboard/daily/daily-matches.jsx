import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@ui/select";
import { Input } from "@ui/input";
import { Plus } from "lucide-react";
import SelectSlot from "@features/dashboard/datalab/slot/select-slot";
import ActionsTable from "@features/dashboard/locker/actions-table";
import { useEditMatch } from "./hook/useEditMatch";
import { rarities } from "@shared/data/rarities.json";
import { useMatchCalculations } from "./hook/useMatchCalculations";

const maps = ["Toxic river", "Award", "Radiation rift"];

const RaritySelect = ({ value, onChange, disabled }) => (
  <Select value={value} onValueChange={onChange} disabled={disabled}>
    <SelectTrigger className="w-12 h-8 px-2">
      <SelectValue>
        {value ? (
          <span style={{ color: rarities.find(r => r.rarity.toLowerCase() === value.toLowerCase())?.color }}>
            {value.charAt(0).toUpperCase()}
          </span>
        ) : (
          "..."
        )}
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      {rarities.sort((a, b) => a.order - b.order).map((rarity) => (
        <SelectItem key={rarity.rarity} value={rarity.rarity.toLowerCase()}>
          <span style={{ color: rarity.color }}>
            {rarity.rarity.charAt(0).toUpperCase()}
          </span>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default function DailyMatches({ matches, builds, loading, onAdd, onUpdate, onDelete }) {
  const { calculateLuckRate, calculateEnergyUsed, calculateMatchMetrics } = useMatchCalculations();
  const {
    editingMatchId,
    editedBuildId,
    editedSlots,
    editedMap,
    editedTime,
    editedResult,
    editedBft,
    editedFlex,
    editedBadges,
    selectedBuild,
    setEditedBuildId,
    setEditedSlots,
    setEditedMap,
    setEditedTime,
    setEditedResult,
    setEditedBft,
    setEditedFlex,
    setEditedBadges,
    handleEdit,
    handleSave,
    handleCancel
  } = useEditMatch(onUpdate, builds);

  if (loading) return <div>Loading...</div>;

  // Calculer le luck rate pour la ligne d'ajout
  const currentLuckRate = calculateLuckRate(editedBadges);
  // Calculer l'énergie utilisée basée sur le temps
  const energyUsed = calculateEnergyUsed(editedTime);

  const handleAddMatch = () => {
    // Vérifier que tous les champs obligatoires sont remplis
    if (!editedBuildId || !editedMap || !editedResult || !editedTime || !editedBft) {
      alert("Veuillez remplir tous les champs obligatoires (Build, Map, Résultat, Temps, BFT)");
      return;
    }

    // Vérifier que tous les badges ont une rareté
    if (!editedBadges || editedBadges.length !== 5 || editedBadges.some(badge => !badge?.rarity)) {
      alert("Veuillez sélectionner une rareté pour les 5 slots de badges");
      return;
    }

    const selectedBuild = builds.find(b => b.id === editedBuildId);
    if (!selectedBuild) {
      alert("Build non trouvé");
      return;
    }

    const matchData = {
      build_id: editedBuildId,
      build: {
        id: editedBuildId,
        buildName: selectedBuild.buildName,
        map: editedMap,
        bonusMultiplier: selectedBuild.bonusMultiplier || 1.0,
        perksMultiplier: selectedBuild.perksMultiplier || 1.0
      },
      map: editedMap,
      time: editedTime,
      energyUsed: energyUsed,
      energyCost: 1.49,
      result: editedResult,
      totalToken: editedBft || 0,
      tokenValue: 0.01,
      totalPremiumCurrency: editedFlex || 0,
      premiumCurrencyValue: 0.00744,
      badges: editedBadges.map(badge => ({
        rarity: badge.rarity,
        nftId: badge.nftId || null
      })),
      luckRate: currentLuckRate
    };

    // Calculer les métriques avant l'envoi
    const enrichedMatch = calculateMatchMetrics(matchData);
    onAdd(enrichedMatch);

    // Réinitialiser les champs après l'ajout
    setEditedBuildId("");
    setEditedMap("");
    setEditedTime("");
    setEditedResult("");
    setEditedBft("");
    setEditedFlex("");
    setEditedBadges(Array(5).fill({ rarity: "rare" }));
  };

  return (
    <div>
      <h2 className="text-3xl font-extrabold py-2">MATCHES</h2>
      <Table>
        <TableCaption>List of today's matches</TableCaption>
        <TableHeader>
          <TableRow className="bg-muted-foreground/30">
            <TableHead>BUILD</TableHead>
            <TableHead>SLOT 1</TableHead>
            <TableHead>SLOT 2</TableHead>
            <TableHead>SLOT 3</TableHead>
            <TableHead>SLOT 4</TableHead>
            <TableHead>SLOT 5</TableHead>
            <TableHead>LUCK RATE</TableHead>
            <TableHead>TIME (min)</TableHead>
            <TableHead>ENERGY USED</TableHead>
            <TableHead>ENERGY COST</TableHead>
            <TableHead>MAP</TableHead>
            <TableHead>RESULT</TableHead>
            <TableHead>$BFT</TableHead>
            <TableHead>$BFT ($)</TableHead>
            <TableHead>FLEX</TableHead>
            <TableHead>FLEX ($)</TableHead>
            <TableHead>PROFIT</TableHead>
            <TableHead>BFT MULTIPLIER</TableHead>
            <TableHead>PERKS MULTIPLIER</TableHead>
            <TableHead>ACTION(S)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Ligne d'ajout */}
          <TableRow>
            <TableCell>
              <Select 
                value={editedBuildId} 
                onValueChange={setEditedBuildId}
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
            </TableCell>
            {[...Array(5)].map((_, index) => (
              <TableCell key={index}>
                <RaritySelect
                  value={editedBadges[index]?.rarity || "rare"}
                  onChange={(value) => {
                    const newBadges = [...editedBadges];
                    newBadges[index] = { rarity: value };
                    setEditedBadges(newBadges);
                  }}
                />
              </TableCell>
            ))}
            <TableCell>{currentLuckRate || "-"}</TableCell>
            <TableCell>
              <Input 
                type="number" 
                className="w-20" 
                placeholder="0" 
                value={editedTime || ""}
                onChange={(e) => setEditedTime(e.target.value)}
              />
            </TableCell>
            <TableCell>{energyUsed || "0.00"}</TableCell>
            <TableCell>${(energyUsed * 1.49).toFixed(2)}</TableCell>
            <TableCell>
              <Select 
                value={editedMap} 
                onValueChange={setEditedMap}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Select map" />
                </SelectTrigger>
                <SelectContent>
                  {maps.map((map) => (
                    <SelectItem key={map} value={map.toLowerCase()}>
                      {map}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Select 
                value={editedResult} 
                onValueChange={setEditedResult}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="Result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="win">Win</SelectItem>
                  <SelectItem value="lose">Lose</SelectItem>
                  <SelectItem value="draw">Draw</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Input 
                type="number" 
                className="w-20" 
                placeholder="0" 
                value={editedBft || ""}
                onChange={(e) => setEditedBft(e.target.value)}
              />
            </TableCell>
            <TableCell>${((editedBft || 0) * 0.01).toFixed(2)}</TableCell>
            <TableCell>
              <Input 
                type="number" 
                className="w-20" 
                placeholder="0" 
                value={editedFlex || ""}
                onChange={(e) => setEditedFlex(e.target.value)}
              />
            </TableCell>
            <TableCell>${((editedFlex || 0) * 0.00744).toFixed(2)}</TableCell>
            <TableCell className="text-green-500">
              ${(
                ((editedBft || 0) * 0.01 + (editedFlex || 0) * 0.00744) - 
                (energyUsed * 1.49)
              ).toFixed(2)}
            </TableCell>
            <TableCell>{builds.find(b => b.id === editedBuildId)?.bonusMultiplier || "1.0"}</TableCell>
            <TableCell>{builds.find(b => b.id === editedBuildId)?.perksMultiplier || "1.0"}</TableCell>
            <TableCell>
              <button
                onClick={handleAddMatch}
                className="p-2 hover:bg-yellow-400 rounded-lg"
              >
                <Plus className="h-4 w-4" />
              </button>
            </TableCell>
          </TableRow>

          {/* Lignes des matches existants */}
          {matches.map((match) => {
            const isEditing = match.id === editingMatchId;
            const currentBuild = builds.find(b => b.id === match.build.id) || match.build;
            const calculated = match.calculated || {};
            const matchEnergyUsed = calculateEnergyUsed(match.time);

            return (
              <TableRow key={match.id}>
                <TableCell>
                  {isEditing ? (
                    <Select value={editedBuildId} onValueChange={setEditedBuildId}>
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
                  ) : (
                    currentBuild.buildName || currentBuild.name
                  )}
                </TableCell>
                {/* 5 slots de badges */}
                {[...Array(5)].map((_, index) => (
                  <TableCell key={index}>
                    {isEditing ? (
                      <RaritySelect
                        value={editedBadges[index]?.rarity || "rare"}
                        onChange={(value) => {
                          const newBadges = [...editedBadges];
                          newBadges[index] = { rarity: value };
                          setEditedBadges(newBadges);
                        }}
                      />
                    ) : (
                      <span style={{ 
                        color: rarities.find(r => 
                          r.rarity.toLowerCase() === (match.badges && match.badges[index]?.rarity || "rare").toLowerCase()
                        )?.color 
                      }}>
                        {(match.badges && match.badges[index]?.rarity || "Rare").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </TableCell>
                ))}
                <TableCell>{calculated.luckRate || "-"}</TableCell>
                <TableCell>{match.time || 0}</TableCell>
                <TableCell>{matchEnergyUsed}</TableCell>
                <TableCell>${(matchEnergyUsed * 1.49).toFixed(2)}</TableCell>
                <TableCell>{match.map}</TableCell>
                <TableCell>{match.result}</TableCell>
                <TableCell>{match.totalToken || 0}</TableCell>
                <TableCell>${((match.totalToken || 0) * 0.01).toFixed(2)}</TableCell>
                <TableCell>{match.totalPremiumCurrency || 0}</TableCell>
                <TableCell>${((match.totalPremiumCurrency || 0) * 0.00744).toFixed(2)}</TableCell>
                <TableCell className="text-green-500">
                  ${(
                    ((match.totalToken || 0) * 0.01 + (match.totalPremiumCurrency || 0) * 0.00744) -
                    (matchEnergyUsed * 1.49)
                  ).toFixed(2)}
                </TableCell>
                <TableCell>{currentBuild.bonusMultiplier || "1.0"}</TableCell>
                <TableCell>{currentBuild.perksMultiplier || "1.0"}</TableCell>
                <TableCell className="flex gap-2 items-center">
                  <ActionsTable
                    data={match}
                    onEdit={() => handleEdit(match)}
                    onDelete={() => onDelete(match.id)}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isEditing={isEditing}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
} 