// src/features/dashboard/cards/TvToolsCard.jsx
import React from "react";
import { Card } from "@ui/card";
import { RewardsPattern1, TvTools } from "@img/index";

export default function TvToolsCard(props) {
  return (
    <Card 
      pattern={RewardsPattern1}
      patternClassName="opacity-40"
      rightIcon={TvTools}
      {...props}
    />
  );
}
