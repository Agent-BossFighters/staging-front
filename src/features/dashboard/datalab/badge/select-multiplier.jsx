import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function SelectMultiplier({ value, onChange }) {
  const handleInputChange = (e) => {
    const inputValue = parseFloat(e.target.value) || 1.0;
    const clampedValue = Math.min(6.0, Math.max(0.1, inputValue));
    onChange(clampedValue);
  };

  const adjustValue = (increment) => {
    const newValue = value + (increment ? 0.1 : -0.1);
    const clampedValue = Math.min(6.0, Math.max(0.1, newValue));
    onChange(parseFloat(clampedValue.toFixed(1)));
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        name="bonus"
        placeholder="1.0"
        value={value}
        onChange={handleInputChange}
        className="w-20 font-bold"
      />
      <div className="flex flex-col">
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4"
          onClick={() => adjustValue(true)}
          disabled={value >= 6.0}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4"
          onClick={() => adjustValue(false)}
          disabled={value <= 0.1}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
