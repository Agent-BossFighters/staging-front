import { Input } from "@ui/input";

export default function BftMultiplierInput({ value, onChange }) {
  return (
    <Input
      type="number"
      name="bonus"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="1.0"
      min="1.0"
      max="5.0"
      step="0.1"
      className="w-1/4 font-bold"
    />
  );
} 