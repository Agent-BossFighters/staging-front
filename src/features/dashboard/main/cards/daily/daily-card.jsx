import * as React from "react";
import { Card } from "@ui/card";
import { RewardsPattern2, Vector } from "@img/index";

const DailyCard = React.forwardRef((props, ref) => {
  return (
    <Card 
      ref={ref} 
      pattern={RewardsPattern2}
      patternClassName="opacity-40"
      rightIcon={Vector}
      {...props}
    />
  );
});

DailyCard.displayName = "DailyCard";

export default DailyCard; 