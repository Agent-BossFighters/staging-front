// src/features/dashboard/cards/MonthlyCard.jsx
import React from "react";
import { Card } from "@ui/card";
import { RewardsPattern2, Monthly } from "@img/index";
import { PremiumFeatureWrapper } from "@shared/components/PremiumFeatureWrapper";

export default function MonthlyCard() {
  return (
    <PremiumFeatureWrapper requiresPremium>
      <Card
        title="MONTHLY"
        description="ACCOUNTING"
        path="/dashboard/schedule/monthly"
        pattern={RewardsPattern2}
        patternClassName="opacity-40"
        icon={Monthly}
      />
    </PremiumFeatureWrapper>
  );
}
