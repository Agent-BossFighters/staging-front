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

export default function SlotCost({ slots, loading }) {
  if (loading) return <div>Loading...</div>;

  return (
    <Table className="">
      <TableCaption>Desc ?</TableCaption>
      <TableHeader>
        <TableRow className="bg-muted-foreground/30">
          <TableHead>NB SLOT(S) UNLOCKED</TableHead>
          <TableHead className="text-destructive">TOTAL FLEX</TableHead>
          <TableHead className="text-destructive">TOTAL COST</TableHead>
          <TableHead>NB TOKENS ROI</TableHead>
          <TableHead>NB CHARGES ROI (1.0 MULTIPLIER)</TableHead>
          <TableHead>NB CHARGES ROI (2.0 MULTIPLIER)</TableHead>
          <TableHead>NB CHARGES ROI (3.0 MULTIPLIER)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="">
        {data.slots.map((item) => (
          <TableRow key={item.slot}>
            <TableCell>{item.slot}</TableCell>
            <TableCell className="text-destructive">{item.totalFlex}</TableCell>
            <TableCell className="text-destructive">
              ${item.totalCost}
            </TableCell>
            <TableCell>{item.nbTokensRoi}</TableCell>
            <TableCell>{item.nbChargesRoi1}</TableCell>
            <TableCell>{item.nbChargesRoi2}</TableCell>
            <TableCell>{item.nbChargesRoi3}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
