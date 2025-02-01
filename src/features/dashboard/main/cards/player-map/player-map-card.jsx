import * as React from "react";
import BaseCard from "../base-card";
import { CardPattern } from "@ui/card";
import { RewardsPattern2, Playermap } from "@img/index";

const PlayerMapCard = React.forwardRef((props, ref) => {
  return (
    <BaseCard ref={ref} {...props}>
      <CardPattern
        pattern={RewardsPattern2}
        className="opacity-40"
      />
      <div className="absolute right-8 top-1/2 -translate-y-1/2">
        <img
          src={Playermap}
          alt=""
          className="w-24 h-24 object-contain"
        />
      </div>
    </BaseCard>
  );
});

PlayerMapCard.displayName = "PlayerMapCard";

export default PlayerMapCard; 