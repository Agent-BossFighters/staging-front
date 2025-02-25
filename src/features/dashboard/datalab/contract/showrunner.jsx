import { useEffect } from "react";
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
import { useContracts } from "./hook/useContracts";
import { getValue } from "../hook/value";

export default function Showrunner() {
  const { contracts, loading, fetchMyContracts } = useContracts();
  const rarities = data.rarities;

  useEffect(() => {
    fetchMyContracts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="overflow-x-auto">
      <Table className="w-1/2">
        <TableCaption>
          Showrunner contract information according to the rarity
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>RARITY</TableHead>
            <TableHead>ITEM</TableHead>
            <TableHead>SUPPLY</TableHead>
            <TableHead>FLOOR PRICE</TableHead>
            <TableHead>LVL MAX</TableHead>
            <TableHead>MAX ENERGY</TableHead>
            <TableHead>TIME TO CRAFT</TableHead>
            <TableHead className="text-destructive">
              NB BADGES
              <br />
              REQUIRED
            </TableHead>
            <TableHead className="text-destructive">
              FLEX
              <br />
              /CRAFT
            </TableHead>
            <TableHead className="text-destructive">
              SP.MARKS
              <br />
              /CRAFT
            </TableHead>
            <TableHead>
              TIME TO
              <br />
              CHARGE
            </TableHead>
            <TableHead className="text-destructive">
              FLEX
              <br />
              /CHARGE
            </TableHead>
            <TableHead className="text-destructive">
              SP.MARKS
              <br />
              /CHARGE
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rarities.map((rarityItem) => {
            const contract = contracts.contracts.find(
              (c) => c["1. rarity"] === rarityItem.rarity
            );

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
                <TableCell>{getValue(contract, "2. item")}</TableCell>
                <TableCell className="text-destructive">
                  {getValue(contract, "3. supply")}
                </TableCell>
                <TableCell>{getValue(contract, "4. floor_price")}</TableCell>
                <TableCell>{getValue(contract, "5. lvl_max")}</TableCell>
                <TableCell>{getValue(contract, "6. max_energy")}</TableCell>
                <TableCell>{getValue(contract, "7. time_to_craft")}</TableCell>
                <TableCell className="text-destructive">
                  {getValue(contract, "8. nb_badges_required")}
                </TableCell>
                <TableCell className="text-destructive">
                  {getValue(contract, "9. flex_craft")}
                </TableCell>
                <TableCell className="text-destructive">
                  {getValue(contract, "10. sp_marks_craft")
                    ? Math.round(getValue(contract, "10. sp_marks_craft"))
                    : "-"}
                </TableCell>
                <TableCell>
                  {getValue(contract, "11. time_to_charge")}
                </TableCell>
                <TableCell className="text-destructive">
                  {getValue(contract, "12. flex_charge")}
                </TableCell>
                <TableCell className="text-destructive">
                  {getValue(contract, "13. sp_marks_charge")
                    ? Math.round(getValue(contract, "13. sp_marks_charge"))
                    : "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
