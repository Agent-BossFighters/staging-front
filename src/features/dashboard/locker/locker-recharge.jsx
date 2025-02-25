import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { Button } from "@ui/button";
import { Pencil } from "lucide-react";

const discountPercent = ["5", "9", "10", "13", "16", "20", "25"];

export default function LockerBadges() {
  return (
    <div className="flex lg:gap-5 lg:h-1/2">
      <div className="lg:w-1/2">
        <h2 className="text-3xl font-extrabold py-2">
          {/* Icon */}RECHARGE DISCOUNT(S)
        </h2>
        <Table className="">
          <TableCaption>Desc ?</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>DISCOUNT TIME</TableHead>
              <TableHead>NUMBER</TableHead>
              <TableHead>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-y-auto">
            {discountPercent.map((discount, index) => (
              <TableRow key={index}>
                <TableCell>{discount} %</TableCell>
                <TableCell>0</TableCell>
                <TableCell className="">
                  <Button
                    variant="transparent"
                    className="hover:text-primary hover:scale-150"
                  >
                    <Pencil />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-1 items-center justify-center">
        <h3 className="text-5xl lg:text-9xl font-bold text-primary">5</h3>
        <p className="text-sm lg:text-2xl font-bold w-2/3 text-center">
          Badge recharge discount(s)
        </p>
      </div>
    </div>
  );
}
