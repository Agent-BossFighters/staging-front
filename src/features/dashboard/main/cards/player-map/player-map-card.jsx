import * as React from "react";
import { Card } from "@ui/card";
import { RewardsPattern2, Playermap } from "@img/index";

const PlayerMapCard = React.forwardRef((props, ref) => {
  return (
    <Card 
      ref={ref} 
      pattern={RewardsPattern2}
      patternClassName="opacity-40"
      rightIcon={Playermap}
      {...props}
    />
  );
});

PlayerMapCard.displayName = "PlayerMapCard";

export default PlayerMapCard; 