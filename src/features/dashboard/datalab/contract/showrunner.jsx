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
import { formatNumber, formatPrice } from "@utils/formatters";
import ShowrunnerSkeleton from "@features/dashboard/datalab/skeletons/ShowrunnerSkeleton";

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
    return <ShowrunnerSkeleton />;
  }
  return (
    <div className="overflow-x-auto max-w-[1200px]">
      <Table className="w-full text-sm">
        <TableCaption>
          Showrunner contract information according to the rarity
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2 text-left">RARITY</TableHead>
            <TableHead className="p-2 text-left">ITEM</TableHead>
            <TableHead className="p-2 text-left">
              MAX
              <br />
              SUPPLY
            </TableHead>
            <TableHead className="p-2 px-4 text-left">
              FLOOR
              <br />
              PRICE
            </TableHead>
            <TableHead className="p-2 text-left">
              LVL
              <br />
              MAX
            </TableHead>
            <TableHead className="p-2 text-left">MAX <br/> ENERGY</TableHead>
            <TableHead className="p-2 text-left">
              BADGE
              <br />
              CRAFT TIME
            </TableHead>
            <TableHead className="p-2 text-left text-destructive">
              NB BADGES
              <br />
              RARITY -1
            </TableHead>
            <TableHead className="p-2 text-left text-destructive">
              FLEX
              <br />
              / CRAFT
            </TableHead>
            <TableHead className="p-2 text-left text-destructive">
              SP. MARKS
              <br />
              / CRAFT
            </TableHead>
            <TableHead className="p-2 text-left text-destructive">
              CRAFTING
              <br />
              COST
            </TableHead>
            <TableHead className="p-2 text-left">
              ENERGY
              <br />
              CHARGE TIME
            </TableHead>
            <TableHead className="p-2 text-left text-destructive">
              FLEX
              <br />
              / CHARGE
            </TableHead>
            <TableHead className="p-2 text-left text-destructive">
              SP. MARKS
              <br />
              / CHARGE
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rarities.map((rarityItem) => {
            const contract = contracts.find(
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
                <TableCell className="p-2 text-left">
                  {getValue(contract, "2. item")}
                </TableCell>
                <TableCell className="p-2 text-left">
                  {formatNumber(getValue(contract, "3. supply"))}
                </TableCell>
                <TableCell className="py-2 text-left">
                  {formatPrice(getValue(contract, "4. floor_price"))}
                </TableCell>
                <TableCell className="p-2 text-left">
                  {formatNumber(getValue(contract, "5. lvl_max"))}
                </TableCell>
                <TableCell className="p-2 text-left">
                  {formatNumber(getValue(contract, "6. max_energy"))}
                </TableCell>
                <TableCell className="p-2 text-left">
                  {getValue(contract, "7. time_to_craft")}
                </TableCell>
                <TableCell className="p-2 text-left text-destructive">
                  {formatNumber(getValue(contract, "8. nb_badges_required"))}
                </TableCell>
                <TableCell className="p-2 text-left text-destructive">
                  {formatNumber(getValue(contract, "9. flex_craft"), 2)}
                </TableCell>
                <TableCell className="p-2 text-left text-destructive">
                  {formatNumber(getValue(contract, "10. sp_marks_craft"))}
                </TableCell>
                <TableCell className="p-2 text-left text-destructive">
                  {formatPrice(getValue(contract, "11. total_craft_cost"))}
                </TableCell>
                <TableCell className="p-2 text-left">
                  {getValue(contract, "12. time_to_charge")}
                </TableCell>
                <TableCell className="p-2 text-left text-destructive">
                  {formatNumber(getValue(contract, "13. flex_charge"))}
                </TableCell>
                <TableCell className="p-2 text-left text-destructive">
                  {formatNumber(getValue(contract, "14. sp_marks_charge"))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
