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
import { Pencil, Check, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@ui/input";
import { useUserPreference } from "@context/userPreference.context";

const discountPercent = ["5", "9", "10", "13", "16", "20", "25"];

export default function LockerRecharge() {
  const { recharges, setRecharges } = useUserPreference();
  const [editingPercent, setEditingPercent] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (percent) => {
    setEditingPercent(percent);
    setEditValue(recharges[percent].toString());
  };

  const handleSave = () => {
    const value = parseInt(editValue) || 0;
    setRecharges((prev) => ({
      ...prev,
      [editingPercent]: value,
    }));
    setEditingPercent(null);
    setEditValue("");
  };

  const handleCancel = () => {
    setEditingPercent(null);
    setEditValue("");
  };

  const total = Object.values(recharges).reduce((sum, val) => sum + val, 0);

  return (
    <div className="flex lg:gap-5 lg:h-1/2 px-5 gap-5">
      <div className="lg:w-3/5 pt-2">
        <Table>
          <TableCaption>List of your recharge discounts</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>DISCOUNT TIME</TableHead>
              <TableHead>NUMBER</TableHead>
              <TableHead>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-y-auto">
            {discountPercent.map((percent) => (
              <TableRow key={percent}>
                <TableCell>{percent} %</TableCell>
                <TableCell>
                  {editingPercent === percent ? (
                    <Input
                      type="number"
                      min="0"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-20"
                    />
                  ) : (
                    recharges[percent]
                  )}
                </TableCell>
                <TableCell>
                  {editingPercent === percent ? (
                    <div className="flex gap-2">
                      <Button
                        variant="transparent"
                        className="p-0 hover:text-accent hover:scale-150"
                        onClick={handleSave}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="transparent"
                        className="p-0 hover:text-destructive hover:scale-150"
                        onClick={handleCancel}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="transparent"
                      className="p-0 hover:text-primary hover:scale-150"
                      onClick={() => handleEdit(percent)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-1 items-center justify-center">
        <h3 className="text-5xl lg:text-9xl font-bold text-primary">{total}</h3>
        <p className="text-sm lg:text-2xl font-bold w-2/3 text-center">
          Badge recharge discount(s)
        </p>
      </div>
    </div>
  );
}
