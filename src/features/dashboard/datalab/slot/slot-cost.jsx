import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { getValue } from "../hook/value";

export default function SlotCost({ slots, loading, selectedRarity }) {
  if (loading) return <div>Loading...</div>;

  const selectedRarityMetrics = slots.unlocked_slots_by_rarity[selectedRarity] || [];

  return (
    <Table className="">
      <TableCaption>Desc ?</TableCaption>
      <TableHeader>
        <TableRow className="bg-muted-foreground/30">
          <TableHead>SLOT</TableHead>
          <TableHead className="text-destructive">NB FLEX</TableHead>
          <TableHead className="text-destructive">FLEX COST</TableHead>
          <TableHead>BONUS $BFT / SLOT</TableHead>
          <TableHead>NORMAL PART $BFT / BADGE</TableHead>
          <TableHead>BONUS PART $BFT / BADGE</TableHead>
          <TableHead>NB TOKENS ROI</TableHead>
          <TableHead>NB CHARGES ROI (1.0)</TableHead>
          <TableHead>NB CHARGES ROI (2.0)</TableHead>
          <TableHead>NB CHARGES ROI (3.0)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="">
        {slots.slots_cost.map((slot, index) => {
          const rarityMetrics = selectedRarityMetrics[index] || {};
          
          return (
            <TableRow key={getValue(slot, "1. slot")}>
              <TableCell>{getValue(slot, "1. slot")}</TableCell>
              <TableCell className="text-destructive">{getValue(slot, "2. nb_flex")}</TableCell>
              <TableCell className="text-destructive">{getValue(slot, "3. flex_cost")}</TableCell>
              <TableCell>{getValue(slot, "4. bonus_bft")}%</TableCell>
              <TableCell>{slot.normalPart}</TableCell>
              <TableCell>{slot.bonusPart}</TableCell>
              <TableCell>{getValue(rarityMetrics, "4. nb_tokens_roi")}</TableCell>
              <TableCell>{getValue(rarityMetrics, "5. nb_charges_roi_1.0")}</TableCell>
              <TableCell>{getValue(rarityMetrics, "6. nb_charges_roi_2.0")}</TableCell>
              <TableCell>{getValue(rarityMetrics, "7. nb_charges_roi_3.0")}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
