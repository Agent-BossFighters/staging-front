import * as React from "react";
import BaseCard from "../base-card";
import { CardPattern } from "@ui/Card";
import { RewardsPattern2, Fighting } from "@img/index";

const FightingCard = React.forwardRef((props, ref) => {
  return (
    <BaseCard ref={ref} {...props}>
      <CardPattern
        pattern={RewardsPattern2}
        className="opacity-40"
      />
      <div className="absolute right-8 top-1/2 -translate-y-1/2">
        <img
          src={Fighting}
          alt=""
          className="w-24 h-24 object-contain"
        />
      </div>
    </BaseCard>
  );
});

FightingCard.displayName = "FightingCard";

export default FightingCard; 