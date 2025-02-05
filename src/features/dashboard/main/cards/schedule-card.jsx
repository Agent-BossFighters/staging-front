// src/features/dashboard/cards/ScheduleCard.jsx
import React from "react";
import { Card } from "@ui/card";
import { Schedule, CustomLeague } from "@img/index";

export default function ScheduleCard({ pattern, ...props }) {
  return (
    <Card 
      rightIcon={Schedule}
      pattern={pattern || CustomLeague}
      patternClassName="absolute inset-0 w-full h-full"
      {...props}
    />
  );
}
