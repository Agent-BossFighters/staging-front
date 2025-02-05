// src/features/dashboard/cards/FightingCard.jsx
import React from "react";
import { Card } from "@ui/card";
import { RewardsPattern2, Fighting } from "@img/index";

export default function FightingCard(props) {
  return (
    <Card 
      pattern={RewardsPattern2}
      patternClassName="opacity-40"
      rightIcon={Fighting}
      {...props}
    />
  );
}
