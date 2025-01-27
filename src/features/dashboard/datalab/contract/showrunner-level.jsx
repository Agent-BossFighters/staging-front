import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";

const levels = Array.from({ length: 15 }, (_, i) => i + 1);

export default function Showrunner() {
  return (
    <>
      <h2 className="text-3xl font-extrabold py-2">
        {/* Icon */}SHOWRUNNER CONTRACTS
      </h2>
      <Table className="">
        <TableCaption>Desc ?</TableCaption>
        <TableHeader>
          <TableRow className="bg-muted-foreground/30">
            <TableHead>LEVEL</TableHead>
            {levels.map((level) => (
              <TableHead
                key={level}
                className={
                  level === 1 || level === 5 || level === 10 || level === 15
                    ? "text-primary"
                    : ""
                }
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
            {levels.map((level) => (
              <TableCell key={level}>{level}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="bg-muted-foreground/30">
              SP. MARKS COST
            </TableCell>
            {levels.map((level) => (
              <TableCell key={level}>{level}</TableCell>
            ))}
          </TableRow>
          <TableRow className="text-destructive">
            <TableCell className="bg-muted-foreground/30">TOTAL COST</TableCell>
            {levels.map((level) => (
              <TableCell key={level}>{level}</TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
