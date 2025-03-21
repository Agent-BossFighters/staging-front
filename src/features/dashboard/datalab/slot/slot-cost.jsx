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
          <TableRow>
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
              TOTAL
              <br /> BONUS $BFT
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
            const totalFlex = rarityMetrics["1. total_flex"] || 0;
            const totalFlexCost = rarityMetrics["2. total_cost"] || 0;
            const totalBonusBft = index > 0 ? `${rarityMetrics["3. total_bonus_bft"]}%` : "0 %";
            const totalTokensRoi = rarityMetrics["4. nb_tokens_roi"] || 0;

            return (
              <TableRow key={getValue(slot, "1. slot")}>
                <TableCell>{getValue(slot, "1. slot")}</TableCell>
                <TableCell className="text-destructive">
                  {totalFlex}
                </TableCell>
                <TableCell className="text-destructive">
                  {totalFlexCost}
                </TableCell>
                <TableCell>{totalBonusBft}</TableCell>
                <TableCell>{totalTokensRoi}</TableCell>
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
