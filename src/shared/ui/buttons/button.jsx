export default function Button({ children, onClick, className, variant = "primary", disabled }) {

  const baseClasses = "w-full font-bold py-2 px-4 rounded transition-all duration-300";
  
  const variants = {
    primary: "bg-primary/80 text-background hover:bg-primary focus:bg-primary",
    declined: "bg-red-500 text-white hover:bg-red-600 focus:bg-red-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:bg-gray-200",
    outline: "border border-gray-500 text-gray-500 hover:border-gray-700 hover:text-gray-700",
  };

  const variantClasses = variants[variant] || variants.primary;

  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabled ? disabledClasses : ""} ${className}`}
    >
      {children}
    </button>
  );
}

