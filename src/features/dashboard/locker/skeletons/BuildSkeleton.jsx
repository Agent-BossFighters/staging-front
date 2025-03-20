import React from "react";
import { Skeleton, TableRowSkeleton, ButtonSkeleton } from "@shared/ui/skeleton";

export default function BuildSkeleton() {
  return (
    <div className="flex flex-col w-[60%] gap-3">
      <div className="flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 p-3 rounded-t-md">
          <div className="flex justify-between">
            <span className="font-bold">BUILD NAME</span>
            <span className="font-bold">$BFT BONUS</span>
            <span className="font-bold">ACTION(S)</span>
          </div>
        </div>
        
        {/* Build rows */}
        <TableRowSkeleton columns={3} className="p-3" />
        
        {/* Add build form */}
        <div className="flex justify-between items-center mt-4 gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <ButtonSkeleton className="h-10 w-10" />
        </div>
      </div>
      
      <div className="text-sm text-gray-400 mt-2">
        List of your builds with their BFT bonus multipliers
      </div>
    </div>
  );
} 