import * as React from "react";
import { Card } from "@ui/card";
import { RewardsPattern2, Fighting } from "@img/index";

const FightingCard = React.forwardRef((props, ref) => {
  return (
    <Card 
      ref={ref} 
      pattern={RewardsPattern2}
      patternClassName="opacity-40"
      rightIcon={Fighting}
      {...props}
    />
  );
});

FightingCard.displayName = "FightingCard";

export default FightingCard; 