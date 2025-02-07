// src/features/dashboard/cards/ScheduleCard.jsx
import React from "react";
import { Card } from "@ui/card";
import { Schedule, CustomLeague } from "@img/index";

export default function ScheduleCard() {
  return (
    <Card 
      title="SCHEDULE"
      description="OPTIMIZE YOUR TIME ACCORDING TO YOUR PROFILE"
      path="/dashboard/schedule"
      pattern={CustomLeague}
      patternClassName="absolute inset-0 w-full h-full object-cover opacity-40"
      icon={Schedule}
    />
  );
}
