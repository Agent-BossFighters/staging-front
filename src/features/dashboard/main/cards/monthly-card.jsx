// src/features/dashboard/cards/MonthlyCard.jsx
import { Card } from "@ui/card";
import { RewardsPattern2, Monthly } from "@img/index";

export default function MonthlyCard() {
  return (
    <Card
      title="MONTHLY"
      description="ACCOUNTING"
      path="/dashboard/schedule/monthly"
      pattern={RewardsPattern2}
      patternClassName="opacity-40"
      icon={Monthly}
    />
  );
}
