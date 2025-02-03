import * as React from "react";
import { Card } from "@ui/card";
import { CustomLeague, Schedule } from "@img/index";

const ScheduleCard = React.forwardRef((props, ref) => {
  return (
    <Card 
      ref={ref} 
      backgroundImage={CustomLeague}
      backgroundClassName="absolute inset-0 bg-center opacity-30"
      rightIcon={Schedule}
      {...props}
    />
  );
});

ScheduleCard.displayName = "ScheduleCard";

export default ScheduleCard; 