import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { useContracts } from "./hook/useContracts";
import { useEffect } from "react";

export default function ShowrunnerLevel() {
  const { levelData, loading, error, fetchMyContracts } = useContracts();
  const levels = Array.from({ length: 30 }, (_, i) => i + 1);

  useEffect(() => {
    fetchMyContracts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h2 className="text-3xl font-extrabold py-2">
        {/* Icon */}SHOWRUNNER LEVEL UP
      </h2>
      <Table className="overflow-y-scroll">
        <TableCaption>Level up costs and requirements for showrunner contracts</TableCaption>
        <TableHeader>
          <TableRow className="bg-muted-foreground/30">
            <TableHead>LEVEL</TableHead>
            {levels.map((level) => (
              <TableHead
                key={level}
                className={level === 1 || level % 5 === 0 ? "text-primary" : ""}
              >
                {level}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="">
          <TableRow>
            <TableCell className="bg-muted-foreground/30">
              SP. MARKS NB
            </TableCell>
            {levels.map((level, index) => (
              <TableCell key={level}>
                {levelData.spMarksNb[index]?.toFixed(2) || "-"}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="bg-muted-foreground/30">
              SP. MARKS COST
            </TableCell>
            {levels.map((level, index) => (
              <TableCell key={level}>
                {levelData.spMarksCost[index] || "-"}
              </TableCell>
            ))}
          </TableRow>
          <TableRow className="text-destructive">
            <TableCell className="bg-muted-foreground/30">TOTAL COST</TableCell>
            {levels.map((level, index) => (
              <TableCell key={level}>
                {levelData.totalCost[index] || "-"}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
