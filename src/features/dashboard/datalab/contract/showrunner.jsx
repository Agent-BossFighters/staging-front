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

export default function Showrunner() {
  return (
    <>
      <h2 className="text-3xl font-extrabold py-2">
        {/* Icon */}SHOWRUNNER CONTRACTS
      </h2>
      <Table className="">
        <TableCaption>Desc ?</TableCaption>
        <TableHeader>
          <TableRow className="bg-muted-foreground/30">
            <TableHead>RARITY</TableHead>
            <TableHead>ITEM</TableHead>
            <TableHead className="text-destructive">SUPPLY</TableHead>
            <TableHead>FLOOR PRICE</TableHead>
            <TableHead>LVL MAX</TableHead>
            <TableHead>MAX ENERGY RECHARGE</TableHead>
            <TableHead>TIME TO CRAFT</TableHead>
            <TableHead className="text-destructive">
              NB BADGES RARITY - 1
            </TableHead>
            <TableHead className="text-destructive">FLEX / CRAFT</TableHead>
            <TableHead className="text-destructive">SP.MARKS / CRAFT</TableHead>
            <TableHead>TIME TO CHARGE</TableHead>
            <TableHead className="text-destructive">FLEX / CHARGE</TableHead>
            <TableHead className="text-destructive">
              SP.MARKS / CHARGE
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {rarity.map((rarityItem) => (
            <TableRow key={rarityItem}>
              <TableCell>{rarityItem}</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell className="text-destructive">$250.00</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell className="text-destructive">$250.00</TableCell>
              <TableCell className="text-destructive">$250.00</TableCell>
              <TableCell className="text-destructive">$250.00</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell className="text-destructive">$250.00</TableCell>
              <TableCell className="text-destructive">$250.00</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
