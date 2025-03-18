import React from "react";
import { Skeleton, TableRowSkeleton, ButtonSkeleton } from "@shared/ui/skeleton";

export default function ShowrunnerContractSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 p-3 rounded-t-md">
          <div className="flex justify-between">
            <span className="font-bold">RARITY</span>
            <span className="font-bold">ITEM</span>
            <span className="font-bold">ID</span>
            <span className="font-bold">PURCHASE PRICE</span>
            <span className="font-bold">ACTION(S)</span>
          </div>
        </div>
        
        {/* Contract rows */}
        <TableRowSkeleton columns={5} className="p-3" />
        
        {/* Add contract form */}
        <div className="flex justify-between items-center mt-4 gap-2">
          <Skeleton className="h-10 w-32" /> {/* Select rarity */}
          <Skeleton className="h-10 flex-1" /> {/* ID input */}
          <Skeleton className="h-10 flex-1" /> {/* Price input */}
          <ButtonSkeleton className="h-10 w-10" />
        </div>
      </div>
      
      <div className="text-sm text-gray-400 mt-2">
        List of your showrunner contracts
      </div>
    </div>
  );
} 