import React from "react";
import { CardsGrid } from "@/features/dashboard/main/cards/cards-grid";
import { DashboardMobile } from "@/features/dashboard/main/dashboard-mobile";

export default function DashboardPage() {
  return (
    <>
      <CardsGrid />
      <DashboardMobile />
    </>
  );
}
