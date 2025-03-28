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
import { formatNumber, formatPrice } from "@utils/formatters";

export default function ShowrunnerLevel() {
  const { levelData, loading, error, fetchMyContracts } = useContracts();
  const levels = Array.from({ length: 70 }, (_, i) => i + 1);

  useEffect(() => {
    fetchMyContracts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!levelData) return <div>No data available</div>;

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
                NB
                <br />
                SP. MARKS
              </TableHead>
              {levels.map((level, index) => (
                <TableCell key={level}>
                  {levelData?.sp_marks_nb?.[index] !== undefined
                    ? formatNumber(Math.round(levelData.sp_marks_nb[index]))
                    : "N/A"}
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
                  {levelData?.sp_marks_cost?.[index] !== undefined 
                    ? formatPrice(levelData.sp_marks_cost[index])
                    : "N/A"}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableHead>TOTAL SP. MARKS</TableHead>
              {levels.map((level, index) => (
                <TableCell key={level}>
                  {levelData?.total_sp_marks?.[index] !== undefined
                    ? formatNumber(levelData.total_sp_marks[index])
                    : "N/A"}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableHead className="text-destructive">TOTAL COST</TableHead>
              {levels.map((level, index) => (
                <TableCell key={level} className="text-destructive">
                  {levelData?.total_cost?.[index] !== undefined
                    ? formatPrice(levelData.total_cost[index])
                    : "N/A"}
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
