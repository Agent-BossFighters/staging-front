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

export default function BadgesPrices() {
  return (
    <>
      <Table className="">
        <TableCaption>Desc ?</TableCaption>
        <TableHeader>
          <TableRow className="bg-muted-foreground/30">
            <TableHead>RARITY</TableHead>
            {data.rarities.map((rarityItem) => (
              <TableHead key={rarityItem} className="p-2 text-center">
                <p
                  className="border-2 rounded-2xl p-1"
                  style={{ borderColor: rarityItem.color }}
                >
                  {rarityItem.rarity}
                </p>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="">
          <TableRow>
            <TableCell>BADGE PRICE</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>FULL RECHARGE PRICE</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>1 ENERGY RECHARGE PRICE</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
          <TableRow className="text-destructive">
            <TableCell>TOTAL COST</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>IN-GAME MINUTES</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>$BFT / MAX RECHARGE</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>$BFT VALUE($)</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>NB CHARGES ROI</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
