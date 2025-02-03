import * as React from "react";
import { Card } from "@ui/card";
import { RewardsPattern2, Monthly } from "@img/index";

const MonthlyCard = React.forwardRef((props, ref) => {
  return (
    <Card 
      ref={ref} 
      pattern={RewardsPattern2}
      patternClassName="opacity-40"
      rightIcon={Monthly}
      {...props}
    />
  );
});

MonthlyCard.displayName = "MonthlyCard";

export default MonthlyCard; 