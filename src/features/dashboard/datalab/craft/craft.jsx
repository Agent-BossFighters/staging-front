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
import { useCrafts } from "./hook/useCrafts";
import { getValue } from "../hook/value";
import { useUserPreference } from "@context/userPreference.context";
import { getRarityOrder } from "@shared/hook/rarity";
import { formatNumber, formatPrice } from "@utils/formatters";
import CraftSkeleton from "@features/dashboard/datalab/skeletons/CraftSkeleton";

const rarity = data.rarities;

export default function Badges() {
  const { crafts, loading, fetchCrafts } = useCrafts();
  const { maxRarity } = useUserPreference();
  const rarities = data.rarities.filter(
    (rarity) => getRarityOrder(rarity.rarity) <= getRarityOrder(maxRarity)
  );

  useEffect(() => {
    fetchCrafts();
  }, []);

  if (loading) return <CraftSkeleton />;

  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-3xl font-extrabold py-2">CRAFT</h2>
      <Table className="w-1/2">
        <TableCaption>
          Craft requirements and SP.MARKS rewards according to rarity level
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>RARITY</TableHead>
            <TableHead>SUPPLY</TableHead>
            <TableHead>
              NB PREVIOUS
              <br />
              RARITY ITEM
            </TableHead>
            <TableHead>BFT</TableHead>
            <TableHead>
              BFT
              <br />
              COST
            </TableHead>
            <TableHead className="text-accent">
              SP.MARKS
              <br />
              /REWARD
            </TableHead>
            <TableHead className="text-accent">
              SP.MARKS
              <br />
              /VALUE
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {rarities.map((rarityItem) => {
            const craft = crafts.find(
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
                <TableCell>{formatNumber(getValue(craft, "2. supply"))}</TableCell>
                <TableCell>
                  {formatNumber(getValue(craft, "3. nb_previous_rarity_item"))}
                </TableCell>
                <TableCell>{formatNumber(getValue(craft, "4. flex_craft"))}</TableCell>
                <TableCell>{formatPrice(getValue(craft, "5. flex_craft_cost"))}</TableCell>
                <TableCell className="text-accent">
                  {formatNumber(getValue(craft, "6. sp_marks_craft"))}
                </TableCell>
                <TableCell className="text-accent">
                  {formatPrice(getValue(craft, "7. sp_marks_value"), 2)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
