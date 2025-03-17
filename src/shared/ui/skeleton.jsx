import React from "react";

// Fonction utilitaire locale pour combiner des classes
const cn = (...classes) => classes.filter(Boolean).join(' ');

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse bg-gray-700 rounded-md", className)}
      {...props}
    />
  );
}

// Variantes couramment utilisées
export function TextSkeleton({ lines = 1, className, ...props }) {
  return (
    <div className="flex flex-col gap-2" {...props}>
      {Array(lines)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={i}
            className={cn("h-4 w-full", i === lines - 1 && "w-4/5", className)}
          />
        ))}
    </div>
  );
}

export function ButtonSkeleton({ className, ...props }) {
  return <Skeleton className={cn("h-10 w-20", className)} {...props} />;
}

export function SelectSkeleton({ className, ...props }) {
  return <Skeleton className={cn("h-10 w-40", className)} {...props} />;
}

export function CardSkeleton({ className, ...props }) {
  return (
    <Skeleton
      className={cn("h-[200px] w-full rounded-lg", className)}
      {...props}
    />
  );
}

export function AvatarSkeleton({ className, ...props }) {
  return <Skeleton className={cn("h-10 w-10 rounded-full", className)} {...props} />;
}

export function TableRowSkeleton({ columns = 3, className, ...props }) {
  return (
    <div className={cn("flex gap-2", className)} {...props}>
      {Array(columns)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-8",
              i === 0 ? "w-1/4" : i === columns - 1 ? "w-1/6" : "flex-1"
            )}
          />
        ))}
    </div>
  );
} 