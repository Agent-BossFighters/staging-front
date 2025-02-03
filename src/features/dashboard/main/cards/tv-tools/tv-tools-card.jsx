import * as React from "react";
import { Card } from "@ui/card";
import { RewardsPattern1, TvTools } from "@img/index";

const TvToolsCard = React.forwardRef((props, ref) => {
  return (
    <Card 
      ref={ref} 
      pattern={RewardsPattern1}
      patternClassName="opacity-40"
      rightIcon={TvTools}
      {...props}
    />
  );
});

TvToolsCard.displayName = "TvToolsCard";

export default TvToolsCard;