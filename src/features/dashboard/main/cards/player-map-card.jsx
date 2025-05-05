// src/features/dashboard/cards/PlayerMapCard.jsx
import React from "react";
import { Card } from "@ui/card";
import { RewardsPattern2, Playermap } from "@img/index";

export default function PlayerMapCard({ onClick }) {
  return (
    <Card
      title="PLAYER MAP"
      description="INTUITION RP COMMUNITY MAP EXPLORER"
      path="/dashboard/playermap"
      pattern={RewardsPattern2}
      patternClassName="absolute inset-0 w-full h-full opacity-40"
      icon={Playermap}
      onClick={onClick}
      soon={true}
    />
  );
}
