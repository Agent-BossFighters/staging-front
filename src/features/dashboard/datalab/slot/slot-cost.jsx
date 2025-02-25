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

  const selectedRarityMetrics =
    slots.unlocked_slots_by_rarity[selectedRarity] || [];

  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full">
        <TableCaption>
          Nb charges ROI according to the badge rarity
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-muted-foreground/30">
            <TableHead>
              NB SLOT(S)
              <br /> UNLOCKED
            </TableHead>
            <TableHead className="text-destructive">
              TOTAL
              <br /> FLEX
            </TableHead>
            <TableHead className="text-destructive">
              TOTAL
              <br /> COST
            </TableHead>
            <TableHead>
              NB TOKENS
              <br /> ROI
            </TableHead>
            <TableHead>
              NB CHARGES
              <br /> ROI (1.0 MULTIPLIER)
            </TableHead>
            <TableHead>
              NB CHARGES
              <br /> ROI (2.0 MULTIPLIER)
            </TableHead>
            <TableHead>
              NB CHARGES
              <br /> ROI (3.0 MULTIPLIER)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {slots.slots_cost.map((slot, index) => {
            const rarityMetrics = selectedRarityMetrics[index] || {};

            return (
              <TableRow key={getValue(slot, "1. slot")}>
                <TableCell>{getValue(slot, "1. slot")}</TableCell>
                <TableCell className="text-destructive">
                  {getValue(slot, "2. nb_flex")}
                </TableCell>
                <TableCell className="text-destructive">
                  {getValue(slot, "3. flex_cost")}
                </TableCell>
                <TableCell>
                  {getValue(rarityMetrics, "4. nb_tokens_roi")}
                </TableCell>
                <TableCell>
                  {getValue(rarityMetrics, "5. nb_charges_roi_1.0")}
                </TableCell>
                <TableCell>
                  {getValue(rarityMetrics, "6. nb_charges_roi_2.0")}
                </TableCell>
                <TableCell>
                  {getValue(rarityMetrics, "7. nb_charges_roi_3.0")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
