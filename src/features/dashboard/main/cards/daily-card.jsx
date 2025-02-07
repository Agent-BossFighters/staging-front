// src/features/dashboard/cards/DailyCard.jsx
import React from "react";
import { Card } from "@ui/card";
import { RewardsPattern2, Vector } from "@img/index";

export default function DailyCard() {
  return (
    <Card 
      title="DAILY"
      description="COMPLETE YOUR DAILY DATA"
      path="/dashboard/daily"
      pattern={RewardsPattern2}
      patternClassName="opacity-40"
      icon={Vector}
      iconClassName="w-[200px] h-[200px] object-contain"
    />
  );
}
