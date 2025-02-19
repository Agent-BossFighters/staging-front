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

const maps = ["Map1", "Map2"];

export default function DailyMatches({ matches, builds, loading, onAdd, onUpdate, onDelete }) {
  const {
    editingMatchId,
    editedBuildId,
    editedSlots,
    editedMap,
    editedFees,
    editedEnergy,
    editedResult,
    editedBft,
    editedFlex,
    editedBftMultiplier,
    editedPerksMultiplier,
    setEditedBuildId,
    setEditedSlots,
    setEditedMap,
    setEditedFees,
    setEditedEnergy,
    setEditedResult,
    setEditedBft,
    setEditedFlex,
    setEditedBftMultiplier,
    setEditedPerksMultiplier,
    handleEdit,
    handleSave,
    handleCancel
  } = useEditMatch(onUpdate);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-3xl font-extrabold py-2">{/* Icon */}MATCHES</h2>
      <Table>
        <TableCaption>List of today's matches</TableCaption>
        <TableHeader>
          <TableRow className="bg-muted-foreground/30">
            <TableHead>BUILD</TableHead>
            <TableHead>SLOTS</TableHead>
            <TableHead>MAP</TableHead>
            <TableHead className="text-destructive">FEES</TableHead>
            <TableHead>ENERGY USED</TableHead>
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
              <Select>
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
            <TableCell>
              <SelectSlot rounded={true} />
            </TableCell>
            <TableCell>
              <Select>
                <SelectTrigger>
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
              <Input type="number" className="w-20" placeholder="0" />
            </TableCell>
            <TableCell>
              <Input type="number" className="w-20" placeholder="0" />
            </TableCell>
            <TableCell>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="win">Win</SelectItem>
                  <SelectItem value="lose">Lose</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Input type="number" className="w-20" placeholder="0" />
            </TableCell>
            <TableCell>$0.00</TableCell>
            <TableCell>
              <Input type="number" className="w-20" placeholder="0" />
            </TableCell>
            <TableCell>$0.00</TableCell>
            <TableCell>$0.00</TableCell>
            <TableCell>
              <Input type="number" className="w-20" placeholder="1.0" step="0.1" min="1.0" max="5.0" />
            </TableCell>
            <TableCell>
              <Input type="number" className="w-20" placeholder="1.0" step="0.1" min="1.0" max="5.0" />
            </TableCell>
            <TableCell>
              <button
                onClick={() => onAdd({})}
                className="p-2 hover:bg-yellow-400 rounded-lg"
              >
                <Plus className="h-4 w-4" />
              </button>
            </TableCell>
          </TableRow>

          {/* Lignes des matches existants */}
          {matches.map((match) => {
            const isEditing = match.id === editingMatchId;

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
                    match.build.name
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <SelectSlot value={editedSlots} onChange={setEditedSlots} rounded={true} />
                  ) : (
                    match.build.slots
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select value={editedMap} onValueChange={setEditedMap}>
                      <SelectTrigger>
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
                  ) : (
                    match.build.map
                  )}
                </TableCell>
                <TableCell className="text-destructive">
                  {isEditing ? (
                    <Input
                      type="number"
                      className="w-20"
                      value={editedFees}
                      onChange={(e) => setEditedFees(e.target.value)}
                    />
                  ) : (
                    `${match.fees.amount} ($${match.fees.cost})`
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      className="w-20"
                      value={editedEnergy}
                      onChange={(e) => setEditedEnergy(e.target.value)}
                    />
                  ) : (
                    match.energy.used
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select value={editedResult} onValueChange={setEditedResult}>
                      <SelectTrigger>
                        <SelectValue placeholder="Result" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="win">Win</SelectItem>
                        <SelectItem value="lose">Lose</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    match.result
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      className="w-20"
                      value={editedBft}
                      onChange={(e) => setEditedBft(e.target.value)}
                    />
                  ) : (
                    match.rewards.bft.amount
                  )}
                </TableCell>
                <TableCell>${match.rewards.bft.value}</TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      className="w-20"
                      value={editedFlex}
                      onChange={(e) => setEditedFlex(e.target.value)}
                    />
                  ) : (
                    match.rewards.flex.amount
                  )}
                </TableCell>
                <TableCell>${match.rewards.flex.value}</TableCell>
                <TableCell className="text-green-500">${match.rewards.profit}</TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      className="w-20"
                      value={editedBftMultiplier}
                      onChange={(e) => setEditedBftMultiplier(e.target.value)}
                      step="0.1"
                      min="1.0"
                      max="5.0"
                    />
                  ) : (
                    match.multipliers.bonus
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      className="w-20"
                      value={editedPerksMultiplier}
                      onChange={(e) => setEditedPerksMultiplier(e.target.value)}
                      step="0.1"
                      min="1.0"
                      max="5.0"
                    />
                  ) : (
                    match.multipliers.perks
                  )}
                </TableCell>
                <TableCell className="flex gap-2 items-center">
                  <ActionsTable
                    data={match}
                    onEdit={handleEdit}
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