import * as React from "react";
import { Link } from 'react-router-dom';
import { cn } from "@/utils/lib/utils";

const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative block rounded-2xl bg-[#1A1B1E] border border-gray-800/50 transition-all duration-300 overflow-hidden group h-full",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
Card.displayName = "Card";

const CardBackground = React.forwardRef(({ className, image, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute inset-0 bg-cover bg-center bg-no-repeat",
      className
    )}
    style={image ? { backgroundImage: `url(${image})` } : {}}
    {...props}
  />
));
CardBackground.displayName = "CardBackground";

const CardPattern = React.forwardRef(({ className, pattern, ...props }, ref) => (
  <img
    ref={ref}
    src={pattern}
    alt=""
    className={cn(
      "absolute inset-0 w-full h-full object-cover",
      className
    )}
    {...props}
  />
));
CardPattern.displayName = "CardPattern";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex h-full z-10 p-6", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-[#FFD32A] font-bold text-[20px] leading-[24px] tracking-wide mb-1",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-gray-300 text-[10px] leading-[14px] font-normal", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const DashboardCard = React.forwardRef(({ 
  className, 
  title, 
  description, 
  path, 
  children,
  ...props 
}, ref) => {
  return (
    <Link to={path} className="block h-full">
      <Card 
        ref={ref} 
        className={cn(
          "hover:bg-gradient-to-br hover:from-yellow-500/10 hover:to-yellow-900/10 hover:scale-[1.02] hover:border-gray-700/50", 
          className
        )} 
        {...props}
      >
        {children}
        <CardContent>
          <div className="flex flex-col justify-end h-full">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

DashboardCard.displayName = "DashboardCard";

export {
  Card,
  CardBackground,
  CardPattern,
  CardContent,
  CardTitle,
  CardDescription,
  DashboardCard,
}; 