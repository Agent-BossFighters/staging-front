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
import { useUserPreference } from "@context/userPreference.context";
import { getRarityOrder } from "@shared/hook/rarity";

export default function Showrunner() {
  const { contracts, loading, fetchMyContracts } = useContracts();
  const { maxRarity } = useUserPreference();
  const rarities = data.rarities.filter(
    (rarity) => getRarityOrder(rarity.rarity) <= getRarityOrder(maxRarity)
  );

  useEffect(() => {
    fetchMyContracts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="overflow-x-auto max-w-[1200px]">
      <Table className="w-full text-sm">
        <TableCaption>
          Showrunner contract information according to the rarity
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2 text-center">RARITY</TableHead>
            <TableHead className="p-2 text-center">ITEM</TableHead>
            <TableHead className="p-2 text-center">
              MAX
              <br />
              SUPPLY
            </TableHead>
            <TableHead className="p-2 text-center">
              FLOOR
              <br />
              PRICE
            </TableHead>
            <TableHead className="p-2 text-center">LVL</TableHead>
            <TableHead className="p-2 text-center">ENERGY</TableHead>
            <TableHead className="p-2 text-center">
              CRAFT
              <br />
              TIME
            </TableHead>
            <TableHead className="p-2 text-center text-destructive">
              NB BADGES
              <br />
              RARITY -1
            </TableHead>
            <TableHead className="p-2 text-center text-destructive">
              FLEX
              <br />
              CRAFT
            </TableHead>
            <TableHead className="p-2 text-center text-destructive">
              MARKS
              <br />
              CRAFT
            </TableHead>
            <TableHead className="p-2 text-center">
              CHARGE
              <br />
              TIME
            </TableHead>
            <TableHead className="p-2 text-center text-destructive">
              FLEX
              <br />
              CHARGE
            </TableHead>
            <TableHead className="p-2 text-center text-destructive">
              MARKS
              <br />
              CHARGE
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
                    className="border-2 rounded-2xl p-1 text-sm"
                    style={{ borderColor: rarityItem.color }}
                  >
                    {rarityItem.rarity}
                  </p>
                </TableCell>
                <TableCell className="p-2 text-center">
                  {getValue(contract, "2. item")}
                </TableCell>
                <TableCell className="p-2 text-center text-destructive">
                  {getValue(contract, "3. supply")}
                </TableCell>
                <TableCell className="p-2 text-center">
                  {getValue(contract, "4. floor_price")}
                </TableCell>
                <TableCell className="p-2 text-center">
                  {getValue(contract, "5. lvl_max")}
                </TableCell>
                <TableCell className="p-2 text-center">
                  {getValue(contract, "6. max_energy")}
                </TableCell>
                <TableCell className="p-2 text-center">
                  {getValue(contract, "7. time_to_craft")}
                </TableCell>
                <TableCell className="p-2 text-center text-destructive">
                  {getValue(contract, "8. nb_badges_required")}
                </TableCell>
                <TableCell className="p-2 text-center text-destructive">
                  {getValue(contract, "9. flex_craft")}
                </TableCell>
                <TableCell className="p-2 text-center text-destructive">
                  {getValue(contract, "10. sp_marks_craft")
                    ? Math.round(getValue(contract, "10. sp_marks_craft"))
                    : "-"}
                </TableCell>
                <TableCell className="p-2 text-center">
                  {getValue(contract, "11. time_to_charge")}
                </TableCell>
                <TableCell className="p-2 text-center text-destructive">
                  {getValue(contract, "12. flex_charge")}
                </TableCell>
                <TableCell className="p-2 text-center text-destructive">
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
