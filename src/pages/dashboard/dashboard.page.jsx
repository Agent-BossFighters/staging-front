import React, { useEffect } from "react";
import { CardsGrid } from "@/features/dashboard/main/cards/cards-grid";
import { DashboardMobile } from "@/features/dashboard/main/dashboard-mobile";
import useUmamiTracking from "@utils/hooks/useUmamiTracking";

export default function DashboardPage() {
  const { track } = useUmamiTracking();

  useEffect(() => {
    // Suivre la visite de la page de tableau de bord
    track("dashboard_view", window.location.pathname, { page: "Dashboard" });
  }, [track]);

  return (
    <div className="w-5/6 mx-auto h-full">
      <CardsGrid />
      <DashboardMobile />
    </div>
  );
}
