import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import data from "@shared/data/rarities.json";

export default function Badges() {
  return (
    <div>
      <h2 className="text-3xl font-extrabold py-2">{/* Icon */}BADGES</h2>
      <Table className="">
        <TableCaption>Desc ?</TableCaption>
        <TableHeader>
          <TableRow className="bg-muted-foreground/30">
            <TableHead>RARITY</TableHead>
            <TableHead>ITEM</TableHead>
            <TableHead>SUPPLY</TableHead>
            <TableHead>FLOOR PRICE</TableHead>
            <TableHead>EFFICIENCY</TableHead>
            <TableHead>RATIO</TableHead>
            <TableHead>MAX ENERGY</TableHead>
            <TableHead>TIME TO CHARGE</TableHead>
            <TableHead>IN-GAME TIME</TableHead>
            <TableHead className="text-destructive">MAX CHARGE COST</TableHead>
            <TableHead className="text-destructive">COST / HOUR</TableHead>
            <TableHead className="text-accent">$BFT / MINUTE</TableHead>
            <TableHead className="text-accent">$BFT / MAX CHARGE</TableHead>
            <TableHead className="text-accent">
              $BFT VALUE / MAX CHARGE
            </TableHead>
            <TableHead className="text-accent">ROI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {data.rarities.map((item) => (
            <TableRow key={item.rarity}>
              <TableCell className="p-2 text-center">
                <p
                  className="border-2 rounded-2xl p-1"
                  style={{ borderColor: item.color }}
                >
                  {item.rarity}
                </p>
              </TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell className="text-destructive">$250.00</TableCell>
              <TableCell className="text-destructive">$250.00</TableCell>
              <TableCell className="text-accent">$250.00</TableCell>
              <TableCell className="text-accent">$250.00</TableCell>
              <TableCell className="text-accent">$250.00</TableCell>
              <TableCell className="text-accent">$250.00</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
