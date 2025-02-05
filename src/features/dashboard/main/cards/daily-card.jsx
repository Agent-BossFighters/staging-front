// src/features/dashboard/cards/DailyCard.jsx
import React from "react";
import { Card } from "@ui/card";
import { RewardsPattern2, Vector } from "@img/index";

export default function DailyCard(props) {
  return (
    <Card 
      pattern={RewardsPattern2}
      patternClassName="opacity-40"
      rightIcon={Vector}
      {...props}
    />
  );
}
