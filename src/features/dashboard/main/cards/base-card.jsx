import * as React from "react";
import { Link } from 'react-router-dom';
import { cn } from "@/utils/lib/utils";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@ui/Card";

const BaseCard = React.forwardRef(({ 
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

BaseCard.displayName = "BaseCard";

export default BaseCard; 