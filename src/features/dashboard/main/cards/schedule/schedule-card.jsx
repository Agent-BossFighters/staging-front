import * as React from "react";
import { Card } from "@ui/card";
import { Schedule } from "@img/index";

const ScheduleCard = React.forwardRef((props, ref) => {
  return (
    <Card 
      ref={ref} 
      rightIcon={Schedule}
      {...props}
    />
  );
});

ScheduleCard.displayName = "ScheduleCard";

export default ScheduleCard; 