// src/features/dashboard/cards/TvToolsCard.jsx
import React from "react";
import { Card } from "@ui/card";
import { RewardsPattern1, TvTools } from "@img/index";

export default function TvToolsCard({ onClick }) {
  return (
    <Card
      title="TV TOOLS"
      description="BE OVERLAY & COMMANDS"
      path="/dashboard/tvtools"
      pattern={RewardsPattern1}
      patternClassName="w-[95%] h-[95%] object-contain mx-auto"
      icon={TvTools}
      onClick={onClick}
      soon={false}
    />
  );
}
