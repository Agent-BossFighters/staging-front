import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@ui/table";
import { Button } from "@ui/button";
import { Plus } from "lucide-react";
import ActionsTable from "./actions-table";

export default function LockerBadges() {
  return (
    <div className="lg:h-1/2">
      <h2 className="text-3xl font-extrabold py-2">{/* Icon */}BUILD(S)</h2>
      <Table className="">
        <TableCaption>Desc ?</TableCaption>
        <TableHeader>
          <TableRow className="bg-muted-foreground/30">
            <TableHead>BUILD NAME</TableHead>
            <TableHead>BONUS MULTIPLIER</TableHead>
            <TableHead>PERKS MULTIPLIER</TableHead>
            <TableHead>ACTION(S)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto">
          <TableRow>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell className="flex gap-2 items-center">
              <ActionsTable />
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter className="bg-transparent">
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell className="flex items-center">
              <Button
                variant="transparent"
                className="p-0 hover:text-primary hover:scale-150"
              >
                <Plus />
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
