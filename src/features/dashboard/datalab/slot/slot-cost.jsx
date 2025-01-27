import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";

export default function SlotCost() {
  return (
    <Table className="lg:w-2/3">
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
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell className="text-destructive">Paid</TableCell>
          <TableCell className="text-destructive">Credit Card</TableCell>
          <TableCell>$250.00</TableCell>
          <TableCell>$250.00</TableCell>
          <TableCell>$250.00</TableCell>
          <TableCell>$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2</TableCell>
          <TableCell className="text-destructive">Paid</TableCell>
          <TableCell className="text-destructive">Credit Card</TableCell>
          <TableCell>$250.00</TableCell>
          <TableCell>$250.00</TableCell>
          <TableCell>$250.00</TableCell>
          <TableCell>$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>3</TableCell>
          <TableCell className="text-destructive">Paid</TableCell>
          <TableCell className="text-destructive">Credit Card</TableCell>
          <TableCell>$250.00</TableCell>
          <TableCell>$250.00</TableCell>
          <TableCell>$250.00</TableCell>
          <TableCell>$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>4</TableCell>
          <TableCell className="text-destructive">Paid</TableCell>
          <TableCell className="text-destructive">Credit Card</TableCell>
          <TableCell>$250.00</TableCell>
          <TableCell>$250.00</TableCell>
          <TableCell>$250.00</TableCell>
          <TableCell>$250.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
