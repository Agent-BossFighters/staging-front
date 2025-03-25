import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { RarityCell } from "@ui/rarity-cell";
import data from "@shared/data/rarities.json";
import { getValue } from "../hook/value";
import { useUserPreference } from "@context/userPreference.context";
import { getRarityOrder } from "@shared/hook/rarity";

export default function Badges({ badges, loading }) {
  const { maxRarity } = useUserPreference();
  const rarities = data.rarities.filter(
    (rarity) => getRarityOrder(rarity.rarity) <= getRarityOrder(maxRarity)
  );

  if (loading) return <div>Loading...</div>;

  if (!badges?.badges_metrics) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-extrabold py-2">{/* Icon */}BADGES</h2>
      <Table className="w-1/2">
        <TableCaption>
          Badge informations according to slot(s) used
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>RARITY</TableHead>
            <TableHead>ITEM</TableHead>
            <TableHead>MAX<br />SUPPLY</TableHead>
            <TableHead>
              FLOOR
              <br />
              PRICE
            </TableHead>
            <TableHead>EFFICIENCY</TableHead>
            <TableHead>RATIO</TableHead>
            <TableHead>
              MAX
              <br />
              ENERGY
            </TableHead>
            <TableHead>
              TIME TO
              <br />
              CHARGE
            </TableHead>
            <TableHead>
              IN GAME
              <br />
              TIME
            </TableHead>
            <TableHead className="text-destructive">
              MAX CHARGE
              <br />
              COST
            </TableHead>
            <TableHead className="text-destructive">
              COST
              <br />
              /HOUR
            </TableHead>
            <TableHead className="text-accent">
              BFT
              <br />
              /MINUTE
            </TableHead>
            <TableHead className="text-accent">
              BFT
              <br />
              /CHARGE
            </TableHead>
            <TableHead className="text-accent">
              BFT
              <br />
              VALUE
            </TableHead>
            <TableHead className="text-accent">ROI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rarities.map((rarityItem) => {
            const badge = badges.badges_metrics.find(
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
