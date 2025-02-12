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

export default function Slot({ slots, loading }) {
  if (loading) return <div>Loading...</div>;

  return (
    <div className="pt-5">
      <h2 className="text-3xl font-extrabold py-2">{/* Icon */}SLOTS COST</h2>
      <Table className="w-1/2">
        <TableCaption>Desc ?</TableCaption>
        <TableHeader>
          <TableRow className="bg-muted-foreground/30">
            <TableHead>SLOT</TableHead>
            <TableHead className="text-destructive">NB FLEX</TableHead>
            <TableHead className="text-destructive">FLEX COST</TableHead>
            <TableHead>BONUS $BFT / SLOT</TableHead>
            <TableHead>NORMAL PART $BFT / BADGE</TableHead>
            <TableHead>BONUS PART $BFT / BADGE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {slots.slots_cost.map((item) => (
            <TableRow key={item.slot}>
              <TableCell>{getValue(item, "1. slot")}</TableCell>
              <TableCell className="text-destructive">
                {getValue(item, "2. nb_flex")}
              </TableCell>
              <TableCell className="text-destructive">
                {getValue(item, "3. flex_cost")}
              </TableCell>
              <TableCell>{getValue(item, "4. bonus_bft")}&nbsp;%</TableCell>
              <TableCell>{item.normalPart}</TableCell>
              <TableCell>{item.bonusPart}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
