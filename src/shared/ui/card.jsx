import * as React from "react";
import { Link } from 'react-router-dom';
import { cn } from "@/utils/lib/utils";

const Card = React.forwardRef(({ 
  className,
  title,
  description,
  path,
  pattern,
  patternClassName,
  backgroundImage,
  backgroundClassName,
  rightIcon,
  rightIconClassName = "w-24 h-24 object-contain",
  children,
  ...props 
}, ref) => {
  const CardWrapper = path ? Link : 'div';
  const wrapperProps = path ? { to: path, className: "block h-full" } : {};

  return (
    <CardWrapper {...wrapperProps}>
      <div
        ref={ref}
        className={cn(
          "relative block rounded-2xl bg-[#1A1B1E] border border-gray-800/50 transition-all duration-300 overflow-hidden group h-full",
          path && "hover:bg-gradient-to-br hover:from-yellow-500/10 hover:to-yellow-900/10 hover:scale-[1.02] hover:border-gray-700/50",
          className
        )}
        {...props}
      >
        {pattern && (
          <img
            src={pattern}
            alt=""
            className={cn(
              "absolute inset-0 w-full h-full object-cover opacity-40",
              patternClassName
            )}
          />
        )}
        {backgroundImage && (
          <div
            className={cn(
              "absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30",
              backgroundClassName
            )}
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
        {rightIcon && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <img
              src={rightIcon}
              alt=""
              className={rightIconClassName}
            />
          </div>
        )}
        {children}
        <div className="relative flex h-full z-10 p-6">
          <div className="flex flex-col justify-end h-full">
            <div>
              {title && (
                <h2 className="text-[#FFD32A] font-bold text-[20px] leading-[24px] tracking-wide mb-1">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-gray-300 text-[10px] leading-[14px] font-normal">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
});

Card.displayName = "Card";

export { Card }; 