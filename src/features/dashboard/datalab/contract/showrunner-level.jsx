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
      <div className="w-full max-w-[1200px] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>LEVEL</TableHead>
              {levels.map((level) => (
                <TableHead
                  key={level}
                  className={
                    level === 1 || level % 5 === 0 ? "text-primary" : ""
                  }
                >
                  {level}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableHead>
                SP. MARKS
                <br />
                NB
              </TableHead>
              {levels.map((level, index) => (
                <TableCell key={level}>
                  {levelData.spMarksNb[index]
                    ? Math.round(levelData.spMarksNb[index])
                    : "-"}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableHead>
                SP. MARKS
                <br />
                COST
              </TableHead>
              {levels.map((level, index) => (
                <TableCell key={level}>
                  {levelData.spMarksCost[index] || "-"}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableHead className="text-destructive">
                TOTAL
                <br />
                COST
              </TableHead>
              {levels.map((level, index) => (
                <TableCell key={level} className="text-destructive">
                  {levelData.totalCost[index] || "-"}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <p className="mt-4 text-base text-muted-foreground text-center max-w-[800px]">
        Showrunner contract level up costs
      </p>
    </>
  );
}
