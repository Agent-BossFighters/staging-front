// src/features/dashboard/cards/TvToolsCard.jsx
import React from "react";
import { Card } from "@ui/card";
import { RewardsPattern1, TvTools } from "@img/index";

export default function TvToolsCard({ onClick }) {
  return (
    <Card
      title="TV TOOLS"
      description="BE OVERLAY & COMMANDS"
      path="/dashboard/tv-tools"
      pattern={RewardsPattern1}
      patternClassName="opacity-40"
      icon={TvTools}
      onClick={onClick}
    />
  );
}
