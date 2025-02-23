// src/features/dashboard/cards/PlayerMapCard.jsx
import React from "react";
import { Card } from "@ui/card";
import { RewardsPattern2, Playermap } from "@img/index";

export default function PlayerMapCard() {
  return (
    <Card
      title="PLAYER MAP"
      description="INTUITION RP COMMUNITY MAP EXPLORER"
      path="/dashboard/player-map"
      pattern={RewardsPattern2}
      patternClassName="absolute inset-0 w-full h-full opacity-40"
      icon={Playermap}
    />
  );
}
