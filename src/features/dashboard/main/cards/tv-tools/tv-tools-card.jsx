import * as React from "react";
import { DashboardCard, CardPattern } from "@ui/card";
import { RewardsPattern1, TvTools } from "@img/index";

const TvToolsCard = React.forwardRef((props, ref) => {
  return (
    <DashboardCard ref={ref} {...props}>
      <CardPattern
        pattern={RewardsPattern1}
        className="opacity-40"
      />
      <div className="absolute right-8 top-1/2 -translate-y-1/2">
        <img
          src={TvTools}
          alt=""
          className="w-24 h-24 object-contain"
        />
      </div>
    </DashboardCard>
  );
});

TvToolsCard.displayName = "TvToolsCard";

export default TvToolsCard;