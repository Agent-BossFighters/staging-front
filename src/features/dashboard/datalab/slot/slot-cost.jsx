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
import { formatNumber, formatPrice, formatPercent } from "@utils/formatters";
import SlotCostSkeleton from "@features/dashboard/datalab/skeletons/SlotCostSkeleton";

export default function SlotCost({ slots, loading, selectedRarity }) {
  if (loading) return <SlotCostSkeleton />;

  const selectedRarityMetrics =
    slots.unlocked_slots_by_rarity[selectedRarity] || [];

  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full">
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

            return (
              <TableRow key={getValue(slot, "1. slot")}>
                <TableCell>{formatNumber(getValue(slot, "1. slot"))}</TableCell>
                <TableCell className="text-destructive">
                  {formatNumber(getValue(rarityMetrics, "1. total_flex"))}
                </TableCell>
                <TableCell className="text-destructive">
                  {formatPrice(getValue(rarityMetrics, "2. total_cost"))}
                </TableCell>
                <TableCell>{formatPercent(getValue(rarityMetrics, "3. total_bonus_bft"))}</TableCell>
                <TableCell>{formatNumber(getValue(rarityMetrics, "4. nb_tokens_roi"))}</TableCell>
                <TableCell>
                  {formatNumber(getValue(rarityMetrics, "5. nb_charges_roi_1.0"), 2)}
                </TableCell>
                <TableCell>
                  {formatNumber(getValue(rarityMetrics, "6. nb_charges_roi_2.0"), 2)}
                </TableCell>
                <TableCell>
                  {formatNumber(getValue(rarityMetrics, "7. nb_charges_roi_3.0"), 2)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <p className="mt-4 text-base text-muted-foreground text-center w-full mx-auto">
          Nb charges ROI according to the badge rarity
      </p>
    </div>
  );
}
