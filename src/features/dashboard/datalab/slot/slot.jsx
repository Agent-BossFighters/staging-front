import { useEffect } from "react";
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
import SlotSkeleton from "@features/dashboard/datalab/skeletons/SlotSkeleton";

export default function Slot({ slots, loading }) {
  if (loading) return <SlotSkeleton />;

  return (
    <div>
      <h2 className="text-3xl font-extrabold py-2">{/* Icon */}SLOTS COST</h2>
      <Table className="w-1/2">
        <TableCaption>
          Normal and bonus part $BFT displayed for a basic common badge
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>SLOT</TableHead>
            <TableHead className="text-destructive">
              NB
              <br />
              FLEX
            </TableHead>
            <TableHead className="text-destructive">
              FLEX
              <br />
              COST
            </TableHead>
            <TableHead>
              BONUS BFT
              <br />
              /SLOT
            </TableHead>
            <TableHead>
              NORMAL BFT
              <br />
              /BADGE
            </TableHead>
            <TableHead>
              BONUS BFT
              <br />
              /BADGE
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {slots.slots_cost.map((item) => (
            <TableRow key={item.slot}>
              <TableCell>{getValue(item, "1. slot")}</TableCell>
              <TableCell className="text-destructive">
                {formatNumber(getValue(item, "2. nb_flex"))}
              </TableCell>
              <TableCell className="text-destructive">
                {formatPrice(getValue(item, "3. flex_cost"))}
              </TableCell>
              <TableCell>{formatPercent(getValue(item, "4. bonus_bft"))}</TableCell>
              <TableCell>{formatNumber(getValue(item, "5. bft_per_badge"))}</TableCell>
              <TableCell>{formatNumber(getValue(item, "6. bonus_per_badge"))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
