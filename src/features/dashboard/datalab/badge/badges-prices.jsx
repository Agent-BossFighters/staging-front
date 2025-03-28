import React from "react";
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
import { useUserPreference } from "@context/userPreference.context";
import { getRarityOrder } from "@shared/hook/rarity";
import { formatPrice, formatNumber } from "@utils/formatters";
import { getValue } from "../hook/value";
import BadgesPricesSkeleton from "@features/dashboard/datalab/skeletons/BadgesPricesSkeleton";

export default function BadgesPrices({ badges, loading }) {
  const { maxRarity } = useUserPreference();

  if (loading) return <BadgesPricesSkeleton />;
  if (!badges?.badges_details) return <p>No data available</p>;

  const rarities = data.rarities.filter(
    (rarity) => getRarityOrder(rarity.rarity) <= getRarityOrder(maxRarity)
  );

  const badgeMap = badges.badges_details.reduce((acc, badge) => {
    acc[badge["1. rarity"]] = badge;
    return acc;
  }, {});

  const rows = [
    { label: "FLOOR\nPRICE", key: "2. badge_price", type: "price" },
    { label: "FULL RECHARGE\nPRICE", key: "3. full_recharge_price", type: "price" },
    {
      label: "TOTAL\nCOST",
      key: "4. total_cost",
      className: "text-destructive",
      type: "price",
    },
    { label: "IN GAME\nTIME", key: "5. in_game_minutes", type: "number" },
    {
      label: "$BFT / MAX\nRECHARGE",
      key: "6. bft_per_max_charge",
      className: "text-accent",
      type: "number",
    },
    { label: "$BFT\nVALUE($)", key: "7. bft_value", className: "text-accent", type: "price" },
    {
      label: "NB CHARGES\nROI",
      key: "9. nb_charges_roi",
      className: "text-accent",
      type: "number",
    },
  ];

  return (
    <div>
      <Table className="w-1/2">
        <TableCaption>
          Badge charges ROI according to $BFT bonus multiplier and slot(s) used
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>RARITY</TableHead>
            {rows.map((row) => (
              <TableHead key={row.key} className={row.className}>
                {row.label.split("\n").map((part, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {part}
                  </React.Fragment>
                ))}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rarities.map((rarityItem) => (
            <TableRow key={rarityItem.rarity}>
              <TableCell className="p-2 text-center">
                <p
                  className="border-2 rounded-2xl p-1 text-sm"
                  style={{ borderColor: rarityItem.color }}
                >
                  {rarityItem.rarity}
                </p>
              </TableCell>
              {rows.map((row) => (
                <TableCell key={row.key} className={row.className}>
                  {row.type === "price" 
                   ? formatPrice(getValue(badgeMap[rarityItem.rarity], row.key) || "-") 
                   : row.type === "number"
                     ? row.key.includes("roi")
                        ? formatNumber(getValue(badgeMap[rarityItem.rarity], row.key) || "-", 2)
                        : formatNumber(getValue(badgeMap[rarityItem.rarity], row.key) || "-")
                     : getValue(badgeMap[rarityItem.rarity], row.key) || "-"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
