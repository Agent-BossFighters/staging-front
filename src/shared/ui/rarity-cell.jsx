import { TableCell } from "./table";

export function RarityCell({ rarity, color }) {
  return (
    <TableCell className="text-center">
      <p className="border-2 rounded-2xl p-1" style={{ borderColor: color }}>
        {rarity}
      </p>
    </TableCell>
  );
}

export function RarityHeader({ rarity, color }) {
  return (
    <th className="text-center">
      <p className="border-2 rounded-2xl" style={{ borderColor: color }}>
        {rarity}
      </p>
    </th>
  );
}
