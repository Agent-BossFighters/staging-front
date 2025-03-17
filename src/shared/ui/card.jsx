import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/lib/utils";
import { Playermap } from "@img/index";

const Card = React.forwardRef(
  (
    {
      className,
      title,
      description,
      path,
      pattern,
      patternClassName,
      backgroundImage,
      backgroundClassName,
      icon,
      iconClassName = "w-28 h-28 object-contain",
      children,
      ...props
    },
    ref
  ) => {
    const CardWrapper = path ? Link : "div";
    const wrapperProps = path ? { to: path, className: "block h-full" } : {};

    return (
      <CardWrapper {...wrapperProps}>
        <div
          ref={ref}
          className={cn(
            "relative block rounded-2xl bg-[#1A1B1E] border-2 border-gray-800/50 transition-all duration-300 overflow-hidden group h-full",
            path &&
              "hover:scale-[1.01] hover:border-gray-700/50",
            className
          )}
          {...props}
        >
          {pattern && (
            <img
              src={pattern}
              alt=""
              className={cn("absolute inset-0 w-full h-full", patternClassName)}
            />
          )}
          {backgroundImage && (
            <div
              className={cn(
                "absolute inset-0 bg-cover bg-center bg-no-repeat",
                backgroundClassName
              )}
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
          )}
          {icon && (
            <div className="absolute right-5 top-5">
              <img
                src={icon}
                alt=""
                className={cn(
                  iconClassName,
                  icon === Playermap ? "scale-125" : ""
                )}
              />
            </div>
          )}
          {children}
          <div className="relative flex h-full z-10 p-8 gap-2">
            <div className="flex flex-col justify-end h-full">
              <div>
                {title && (
                  <h2 className="text-[#FFD32A] font-bold text-4xl leading-10 tracking-wide mb-2">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-gray-300 text-sm leading-5 font-normal">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardWrapper>
    );
  }
);

Card.displayName = "Card";

export { Card };
