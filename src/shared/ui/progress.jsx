"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/utils/lib/utils"

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-1.5 w-full overflow-hidden rounded-full bg-gray-800",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-[#FFD32A] transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

const XPProgress = React.forwardRef(({ 
  currentLevel, 
  nextLevel, 
  currentXP, 
  requiredXP, 
  className, 
  ...props 
}, ref) => (
  <div 
    className={cn(
      "bg-[#1A1B1E] rounded-2xl p-3 border border-gray-800/50", 
      className
    )} 
    {...props}
  >
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-[#FFD32A] font-bold text-sm">
        Level {currentLevel}
      </span>
      <span className="text-gray-500 text-xs">
        Level {nextLevel}
      </span>
    </div>
    
    <Progress 
      ref={ref} 
      value={(currentXP / requiredXP) * 100} 
    />
    
    <div className="flex justify-between items-center mt-1">
      <span className="text-gray-500 text-xs">{currentXP} XP</span>
      <span className="text-gray-500 text-xs">{requiredXP} XP</span>
    </div>
  </div>
));
XPProgress.displayName = "XPProgress"

export { Progress, XPProgress }
