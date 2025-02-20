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
  const {
    editingMatchId,
    editedBuildId,
    editedSlots,
    editedMap,
    editedEnergy,
    editedResult,
    editedBft,
    editedFlex,
    editedBadges,
    selectedBuild,
    setEditedBuildId,
    setEditedSlots,
    setEditedMap,
    setEditedEnergy,
    setEditedResult,
    setEditedBft,
    setEditedFlex,
    setEditedBadges,
    handleEdit,
    handleSave,
    handleCancel
  } = useEditMatch(onUpdate, builds);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-3xl font-extrabold py-2">{/* Icon */}MATCHES</h2>
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
                onValueChange={(value) => {
                  setEditedBuildId(value);
                }}
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
            <TableCell>{selectedBuild?.luck_rate || "-"}</TableCell>
            <TableCell>
              <Input 
                type="number" 
                className="w-20" 
                placeholder="0" 
                onChange={(e) => setEditedEnergy(e.target.value)}
              />
            </TableCell>
            <TableCell>$1.75</TableCell>
            <TableCell>
              <Select onValueChange={setEditedMap}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Select" />
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
              <Select onValueChange={setEditedResult}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="Select" />
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
                onChange={(e) => setEditedBft(e.target.value)}
              />
            </TableCell>
            <TableCell>$0.00</TableCell>
            <TableCell>
              <Input 
                type="number" 
                className="w-20" 
                placeholder="0" 
                onChange={(e) => setEditedFlex(e.target.value)}
              />
            </TableCell>
            <TableCell>$0.00</TableCell>
            <TableCell>$0.00</TableCell>
            <TableCell>{builds.find(b => b.id === editedBuildId)?.bonusMultiplier || "1.0"}</TableCell>
            <TableCell>{builds.find(b => b.id === editedBuildId)?.perksMultiplier || "1.0"}</TableCell>
            <TableCell>
              <button
                onClick={() => onAdd({
                  build_id: editedBuildId,
                  build: {
                    id: editedBuildId,
                    buildName: builds.find(b => b.id === editedBuildId)?.buildName || '',
                    map: editedMap
                  },
                  slots: editedSlots,
                  map: editedMap,
                  energyUsed: editedEnergy,
                  energyCost: 0.1,
                  result: editedResult,
                  totalToken: editedBft || 0,
                  tokenValue: 0.2,
                  totalPremiumCurrency: editedFlex || 0,
                  premiumCurrencyValue: 0.1,
                  badges: editedBadges
                })}
                className="p-2 hover:bg-yellow-400 rounded-lg"
              >
                <Plus className="h-4 w-4" />
              </button>
            </TableCell>
          </TableRow>

          {/* Lignes des matches existants */}
          {matches.map((match) => {
            const isEditing = match.id === editingMatchId;
            const currentBuild = isEditing ? selectedBuild : match.build;

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
                    currentBuild.buildName || match.build.name
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
                <TableCell>{currentBuild.luck_rate}</TableCell>
                <TableCell>{match.energy.used}</TableCell>
                <TableCell>${match.energy.cost}</TableCell>
                <TableCell>{currentBuild.map}</TableCell>
                <TableCell>{match.result}</TableCell>
                <TableCell>{match.rewards.bft.amount}</TableCell>
                <TableCell>${match.rewards.bft.value}</TableCell>
                <TableCell>{match.rewards.flex.amount}</TableCell>
                <TableCell>${match.rewards.flex.value}</TableCell>
                <TableCell className="text-green-500">${match.rewards.profit}</TableCell>
                <TableCell>{match.build.bonusMultiplier || "1.0"}</TableCell>
                <TableCell>{match.build.perksMultiplier || "1.0"}</TableCell>
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