// src/features/dashboard/cards/MonthlyCard.jsx
import React from "react";
import { Card } from "@ui/card";
import { RewardsPattern2, Monthly } from "@img/index";

export default function MonthlyCard(props) {
  return (
    <Card 
      pattern={RewardsPattern2}
      patternClassName="opacity-40"
      rightIcon={Monthly}
      {...props}
    />
  );
}
