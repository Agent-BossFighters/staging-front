import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";

export default function Slot() {
  return (
    <>
      <h2 className="text-3xl font-extrabold py-2">{/* Icon */}SLOTS COST</h2>
      <Table className="lg:w-1/2">
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
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell className="text-destructive">Paid</TableCell>
            <TableCell className="text-destructive">Credit Card</TableCell>
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
          </TableRow>
          <TableRow>
            <TableCell>3</TableCell>
            <TableCell className="text-destructive">Paid</TableCell>
            <TableCell className="text-destructive">Credit Card</TableCell>
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
          </TableRow>
          <TableRow>
            <TableCell>5</TableCell>
            <TableCell className="text-destructive">Paid</TableCell>
            <TableCell className="text-destructive">Credit Card</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
