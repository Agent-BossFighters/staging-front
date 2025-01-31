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
import contractData from "@shared/data/contract.json";

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
            <TableHead>TIME TO CRAFT (H)</TableHead>
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
        <TableBody>
          {data.rarities.map((rarityItem, index) => {
            const contract = contractData.contracts[index]; // Récupération par index

            return (
              <TableRow key={rarityItem.rarity}>
                <TableCell className="p-2 text-center">
                  <p
                    className="border-2 rounded-2xl p-1"
                    style={{ borderColor: rarityItem.color }}
                  >
                    {rarityItem.rarity}
                  </p>
                </TableCell>
                <TableCell>{contract?.item || "N/A"}</TableCell>
                <TableCell className="text-destructive">
                  {contract?.supply || "N/A"}
                </TableCell>
                <TableCell>
                  {contract?.price ? `$${contract.price}` : "N/A"}
                </TableCell>
                <TableCell>{contract?.lvl || "N/A"}</TableCell>
                <TableCell>{contract?.maxEnergy || "N/A"}</TableCell>
                <TableCell>
                  {contract?.timeToCraft ? `${contract.timeToCraft}h` : "N/A"}
                </TableCell>
                <TableCell className="text-destructive">
                  {contract?.nbBadges || "N/A"}
                </TableCell>
                <TableCell className="text-destructive">
                  {contract?.flex || "N/A"}
                </TableCell>
                <TableCell className="text-destructive">
                  {contract?.spMarks || "N/A"}
                </TableCell>
                <TableCell>{contract?.timeToCharge || "N/A"}</TableCell>
                <TableCell className="text-destructive">
                  {contract?.flexCharge || "N/A"}
                </TableCell>
                <TableCell className="text-destructive">
                  {contract?.spMarksCharge || "N/A"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
