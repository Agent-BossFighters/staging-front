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
import { LUCK_RATES } from "@constants/gameConstants";
import { useState } from "react";

const maps = ["Toxic river", "Award", "Radiation rift"];

const RaritySelect = ({ value, onChange, disabled }) => (
  <Select value={value || "rare"} onValueChange={onChange} disabled={disabled}>
    <SelectTrigger className="w-12 h-8 px-2">
      <SelectValue>
        {value ? (
          <span style={{ color: rarities.find(r => r.rarity.toLowerCase() === value.toLowerCase())?.color }}>
            {value.charAt(0).toUpperCase()}
          </span>
        ) : (
          <span style={{ color: rarities.find(r => r.rarity.toLowerCase() === "rare")?.color }}>
            R
          </span>
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
  const { calculateLuckrate, calculateEnergyUsed } = useMatchCalculations();
  const [editedBuildId, setEditedBuildId] = useState("");
  const [editedMap, setEditedMap] = useState("");
  const [editedTime, setEditedTime] = useState("");
  const [editedResult, setEditedResult] = useState("");
  const [editedBft, setEditedBft] = useState("");
  const [editedFlex, setEditedFlex] = useState("");
  const [editedRarities, setEditedRarities] = useState(Array(5).fill("rare"));
  const [editingMatchId, setEditingMatchId] = useState(null);

  if (loading) return <div>Loading...</div>;

  // Calculer l'énergie utilisée basée sur le temps
  const energyUsed = calculateEnergyUsed(editedTime);
  // Calculer le luck rate basé sur les raretés
  const currentLuckrate = calculateLuckrate(editedRarities);

  const handleAddMatch = () => {
    // Vérifier que tous les champs obligatoires sont remplis
    if (!editedBuildId || !editedMap || !editedResult || !editedTime || !editedBft) {
      alert("Veuillez remplir tous les champs obligatoires (Build, Map, Résultat, Temps, BFT)");
      return;
    }

    const selectedBuild = builds.find(b => b.id === editedBuildId);
    if (!selectedBuild) {
      alert("Build non trouvé");
      return;
    }

    // Créer les badge_used pour chaque slot
    const badges = editedRarities.map((rarity, index) => ({
      slot: index + 1,
      rarity: rarity,
      _destroy: false
    }));

    console.log('--- Nouveau match ---');
    console.log('Raretés:', editedRarities.join(', '));

    const matchData = {
      match: {
        date: new Date().toISOString(),
        build: selectedBuild.buildName,
        map: editedMap,
        time: editedTime,
        result: editedResult,
        totalToken: editedBft || 0,
        totalPremiumCurrency: editedFlex || 0,
        badge_used_attributes: badges
      }
    };

    onAdd(matchData);
    
    // Réinitialiser les champs
    setEditedBuildId("");
    setEditedMap("");
    setEditedTime("");
    setEditedResult("");
    setEditedBft("");
    setEditedFlex("");
    setEditedRarities(Array(5).fill("rare"));
  };

  const handleEdit = (match) => {
    setEditingMatchId(match.id);
    setEditedBuildId(builds.find(b => b.buildName === match.build)?.id || "");
    setEditedMap(match.map);
    setEditedTime(match.time);
    setEditedResult(match.result);
    setEditedBft(match.totalToken);
    setEditedFlex(match.totalPremiumCurrency);
    setEditedRarities(match.selectedRarities || Array(5).fill("rare"));
  };

  const handleSave = () => {
    const selectedBuild = builds.find(b => b.id === editedBuildId);
    if (!selectedBuild) return;

    // Créer les badge_used pour chaque slot
    const badges = editedRarities.map((rarity, index) => ({
      slot: index + 1,
      rarity: rarity,
      _destroy: false
    }));

    const updatedMatch = {
      match: {
        date: new Date().toISOString(),
        build: selectedBuild.buildName,
        map: editedMap,
        time: editedTime,
        result: editedResult,
        totalToken: editedBft || 0,
        totalPremiumCurrency: editedFlex || 0,
        badge_used_attributes: badges
      }
    };

    onUpdate(editingMatchId, updatedMatch);
    setEditingMatchId(null);
  };

  const handleCancel = () => {
    setEditingMatchId(null);
    setEditedBuildId("");
    setEditedMap("");
    setEditedTime("");
    setEditedResult("");
    setEditedBft("");
    setEditedFlex("");
    setEditedRarities(Array(5).fill("rare"));
  };

  const enrichedMatches = matches.map(match => {
    const currentBuild = builds.find(b => b.buildName === match.build) || { buildName: match.build };
    return {
      ...match,
      build: {
        ...currentBuild,
        bonusMultiplier: currentBuild.bonusMultiplier || 1.0,
        perksMultiplier: currentBuild.perksMultiplier || 1.0
      }
    };
  });

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
            {/* 5 slots de badges */}
            {[...Array(5)].map((_, index) => (
              <TableCell key={index}>
                <RaritySelect
                  value={editedRarities[index] || "rare"}
                  onChange={(value) => {
                    const newRarities = [...editedRarities];
                    newRarities[index] = value;
                    setEditedRarities(newRarities);
                  }}
                />
              </TableCell>
            ))}
            <TableCell>{calculateLuckrate(editedRarities)}</TableCell>
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
                  <SelectItem value="loss">Loss</SelectItem>
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
          {enrichedMatches.map((match) => {
            const isEditing = match.id === editingMatchId;
            const currentBuild = builds.find(b => b.buildName === match.build);
            // Récupérer les raretés depuis badge_used ou selectedRarities
            const matchRarities = match.badge_used?.map(badge => badge.rarity) || 
                                 match.badges?.map(badge => badge.rarity) ||
                                 match.selectedRarities ||
                                 Array(5).fill("rare");

            if (match.badge_used || match.badges || match.selectedRarities) {
              console.log(`Match #${match.id} - Raretés:`, matchRarities.join(', '));
            }

            const matchLuckrate = calculateLuckrate(matchRarities);
            const matchEnergyUsed = calculateEnergyUsed(match.time);
            
            console.log('Match data:', match);

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
                    match.build.buildName
                  )}
                </TableCell>
                {/* 5 slots de badges */}
                {[...Array(5)].map((_, index) => {
                  const rarity = isEditing ? editedRarities[index] : matchRarities[index];
                  const rarityInfo = rarities.find(r => r.rarity.toLowerCase() === (rarity || 'rare').toLowerCase());
                  
                  return (
                    <TableCell key={index}>
                      {isEditing ? (
                        <RaritySelect
                          value={rarity || "rare"}
                          onChange={(value) => {
                            const newRarities = [...editedRarities];
                            newRarities[index] = value;
                            setEditedRarities(newRarities);
                          }}
                        />
                      ) : (
                        <span style={{ color: rarityInfo?.color }}>
                          {(rarity || "rare").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </TableCell>
                  );
                })}
                <TableCell>{matchLuckrate}</TableCell>
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
                <TableCell>{currentBuild?.bonusMultiplier || "1.0"}</TableCell>
                <TableCell>{currentBuild?.perksMultiplier || "1.0"}</TableCell>
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