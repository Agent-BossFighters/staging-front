import { Input } from "@ui/input";

export const NumericInput = ({ value, onChange, placeholder, className }) => {
  const handleChange = (e) => {
    const newValue = e.target.value;

    if (newValue === "" || /^\d*\.?\d*$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      className={`${className} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
    />
  );
};
