import * as React from "react";
import { Card } from "@ui/card";
import { BackgroundLocker, Locker } from "@img/index";

const LockerCard = React.forwardRef(({ backgroundimage, ...props }, ref) => {
  return (
    <Card 
      ref={ref} 
      backgroundImage={BackgroundLocker}
      backgroundClassName="absolute inset-0 opacity-20"
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
      {backgroundimage && (
        <div className="absolute w-[90%] h-[90%] m-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <img
            src={backgroundimage}
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </Card>
  );
});

LockerCard.displayName = "LockerCard";

export default LockerCard;