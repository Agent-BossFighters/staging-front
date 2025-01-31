import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import data from "@shared/data/slot.json";

export default function Slot() {
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
          {data.cost.map((item) => (
            <TableRow key={item.slot}>
              <TableCell>{item.slot}</TableCell>
              <TableCell className="text-destructive">{item.nbFlex}</TableCell>
              <TableCell className="text-destructive">
                ${item.flexCost}
              </TableCell>
              <TableCell>{item.bonus}</TableCell>
              <TableCell>{item.normalPart}</TableCell>
              <TableCell>{item.bonusPart}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
