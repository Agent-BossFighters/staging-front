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

export default function BadgesPrices({ badges, loading }) {
  if (loading) return <p>Loading...</p>;
  if (!badges || badges.length === 0) return <p>No data available</p>;

  const rarities = data.rarities;
  const badgeMap = badges.badges_details.reduce((acc, badge) => {
    acc[badge["1. rarity"]] = badge;
    return acc;
  }, {});

  const rows = [
    { label: "BADGE PRICE", key: "2. badge_price" },
    { label: "FULL RECHARGE PRICE", key: "3. full_recharge_price" },
    { label: "TOTAL COST", key: "4. total_cost" },
    { label: "IN-GAME MINUTES", key: "5. in_game_minutes" },
    { label: "$BFT / MAX RECHARGE", key: "6. bft_per_max_charge" },
    { label: "$BFT VALUE($)", key: "7. bft_value" },
    { label: "NB CHARGES ROI", key: "8. roi" },
  ];

  return (
    <Table>
      <TableCaption>Badge Prices and Recharge Costs</TableCaption>
      <TableHeader>
        <TableRow className="bg-muted-foreground/30">
          <TableHead>RARITY</TableHead>
          {rarities.map((rarity) => (
            <TableHead key={rarity.color} className="p-2 text-center">
              <p
                className="border-2 rounded-2xl p-1"
                style={{ borderColor: rarity.color }}
              >
                {rarity.rarity}
              </p>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.key}
            className={row.label === "TOTAL COST" ? "text-destructive" : ""}
          >
            <TableCell>{row.label}</TableCell>
            {rarities.map((rarity) => (
              <TableCell key={rarity.rarity} className="">
                {badgeMap[rarity.rarity]?.[row.key] || "-"}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
