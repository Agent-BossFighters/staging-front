import { Card } from "@ui/card";
import { RewardsPattern2, Spark } from "@img/index";

export default function DailyCard() {
  return (
    <Card
      title="DAILY"
      description="COMPLETE YOUR DAILY DATA"
      path="/dashboard/daily"
      pattern={RewardsPattern2}
      patternClassName="opacity-40"
      icon={Spark}
      iconClassName="w-[220px] h-[220px] object-contain"
    />
  );
}
