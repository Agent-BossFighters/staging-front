import React from "react";
import { cn } from "@utils/cn";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-gray-700 text-white",
    primary: "bg-yellow-400 text-black",
    secondary: "bg-blue-500 text-white",
    success: "bg-green-500 text-white",
    destructive: "bg-red-500 text-white",
    outline: "bg-transparent border border-gray-600 text-gray-300",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export { Badge }; 