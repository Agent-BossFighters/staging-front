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
import { getValue } from "../hook/value";

export default function Badges({ badges, loading }) {
  const rarities = data.rarities;
  if (loading) return <div>Loading...</div>;
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
          {rarities.map((rarityItem) => {
            const badge = badges.badges_metrics.find(
              (c) => c["1. rarity"] === rarityItem.rarity,
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
                <TableCell>{getValue(badge, "2. item")}</TableCell>
                <TableCell>{getValue(badge, "3. supply")}</TableCell>
                <TableCell>{getValue(badge, "4. floor_price")}</TableCell>
                <TableCell>{getValue(badge, "5. efficiency")}</TableCell>
                <TableCell>{getValue(badge, "6. ratio")}</TableCell>
                <TableCell>{getValue(badge, "7. max_energy")}</TableCell>
                <TableCell>{getValue(badge, "8. time_to_charge")}</TableCell>
                <TableCell>{getValue(badge, "9. in_game_time")}</TableCell>
                <TableCell className="text-destructive">
                  {getValue(badge, "10. recharge_cost")}
                </TableCell>
                <TableCell className="text-destructive">
                  {getValue(badge, "11. cost_per_hour")}
                </TableCell>
                <TableCell className="text-accent">
                  {getValue(badge, "12. bft_per_minute")}
                </TableCell>
                <TableCell className="text-accent">
                  {getValue(badge, "13. bft_per_max_charge")}
                </TableCell>
                <TableCell className="text-accent">
                  {getValue(badge, "14. bft_value_per_max_charge")}
                </TableCell>
                <TableCell className="text-accent">
                  {getValue(badge, "15. roi")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
