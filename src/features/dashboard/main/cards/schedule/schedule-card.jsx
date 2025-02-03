import * as React from "react";
import { Card } from "@ui/card";
import { Schedule, CustomLeague } from "@img/index";

const ScheduleCard = React.forwardRef((props, ref) => {
  return (
    <Card 
      ref={ref} 
      rightIcon={Schedule}
      backgroundImage={CustomLeague}
      backgroundClassName="opacity-10"
      {...props}
    />
  );
});

ScheduleCard.displayName = "ScheduleCard";

export default ScheduleCard; 