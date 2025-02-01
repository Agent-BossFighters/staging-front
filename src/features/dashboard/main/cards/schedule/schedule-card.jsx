import * as React from "react";
import { DashboardCard, CardBackground } from "@ui/Card";
import { CustomLeague, Schedule } from "@img/index";

const ScheduleCard = React.forwardRef((props, ref) => {
  return (
    <DashboardCard ref={ref} {...props}>
      <CardBackground 
        image={CustomLeague}
        className="absolute inset-0 bg-center opacity-30" 
      />
      <div className="absolute right-8 top-1/2 -translate-y-1/2">
        <img
          src={Schedule}
          alt=""
          className="w-24 h-24 object-contain"
        />
      </div>
    </DashboardCard>
  );
});

ScheduleCard.displayName = "ScheduleCard";

export default ScheduleCard; 