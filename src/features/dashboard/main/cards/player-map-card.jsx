// src/features/dashboard/cards/PlayerMapCard.jsx
import React from "react";
import { Card } from "@ui/card";
import { RewardsPattern2 } from "@img/index";

export default function PlayerMapCard(props) {
  return (
    <Card 
      pattern={RewardsPattern2}
      patternClassName="absolute inset-0 w-full h-full"
      {...props} 
    />
  );
}
