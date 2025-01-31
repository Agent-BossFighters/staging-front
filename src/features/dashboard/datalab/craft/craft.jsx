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
      <h2 className="text-3xl font-extrabold py-2">
        {/* Icon */}CRAFT DIGITAL ASSETS
      </h2>
      <Table className="w-1/2">
        <TableCaption>Desc ?</TableCaption>
        <TableHeader>
          <TableRow className="bg-muted-foreground/30">
            <TableHead>RARITY</TableHead>
            <TableHead>SUPPLY</TableHead>
            <TableHead>NB PREVIOUS RARITY ITEM</TableHead>
            <TableHead>$BFT</TableHead>
            <TableHead>$BFT COST</TableHead>
            <TableHead className="text-accent">SP.MARKS REWARD</TableHead>
            <TableHead className="text-accent">SP.MARKS VALUE</TableHead>
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
              <TableCell className="text-accent">$250.00</TableCell>
              <TableCell className="text-accent">$250.00</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
