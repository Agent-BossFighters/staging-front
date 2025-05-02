// src/features/dashboard/cards/FightingCard.jsx
import { Card } from "@ui/card";
import { RewardsPattern2, Fighting } from "@img/index";

export default function FightingCard({ onClick }) {
  return (
    <Card
      title="FIGHTING"
      description="TOURNAMENTS & CUPS WITH CUSTOM RULES"
      path="/dashboard/fighting"
      pattern={RewardsPattern2}
      patternClassName="opacity-40"
      icon={Fighting}
      onClick={onClick}
    />
  );
}
