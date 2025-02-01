import * as React from "react";
import { DashboardCard, CardBackground } from "@ui/Card";
import { BackgroundLocker } from "@img/index";

const LockerCard = React.forwardRef(({ backgroundimage, ...props }, ref) => {
  return (
    <DashboardCard ref={ref} {...props}>
      <CardBackground 
        image={BackgroundLocker}
        className="absolute inset-0 opacity-20" 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
      {backgroundimage && (
        <CardBackground 
          image={backgroundimage} 
          className="w-[90%] h-[90%] m-auto top-[85%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-contain"
        />
      )}
    </DashboardCard>
  );
});

LockerCard.displayName = "LockerCard";

export default LockerCard;