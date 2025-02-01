import * as React from "react";
import { DashboardCard, CardBackground } from "@ui/Card";

const DataLabCard = React.forwardRef(({ backgroundimage, ...props }, ref) => {
  return (
    <DashboardCard ref={ref} {...props}>
      {backgroundimage && (
        <CardBackground 
          image={backgroundimage}
          className="absolute inset-0 bg-center opacity-30" 
        />
      )}
    </DashboardCard>
  );
});

DataLabCard.displayName = "DataLabCard";

export default DataLabCard; 