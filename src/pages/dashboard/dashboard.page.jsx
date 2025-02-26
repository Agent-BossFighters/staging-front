import React from "react";
import { CardsGrid } from "@/features/dashboard/main/cards/cards-grid";
import { DashboardMobile } from "@/features/dashboard/main/dashboard-mobile";

export default function DashboardPage() {
  return (
    <div className="w-5/6 mx-auto h-full">
      <CardsGrid />
      <DashboardMobile />
    </div>
  );
}
