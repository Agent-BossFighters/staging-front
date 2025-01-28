import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";

const rarity = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
  "exalted",
  "exotic",
  "transcendent",
  "unique",
];

export default function Badges() {
  return (
    <>
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
          {rarity.map((rarityItem) => (
            <TableRow key={rarityItem}>
              <TableCell>{rarityItem}</TableCell>
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
    </>
  );
}
