import * as React from "react";
import { Card } from "@ui/card";
import { BackgroundPreseason } from "@img/index";

const DataLabCard = React.forwardRef(({ backgroundimage, ...props }, ref) => {
  return (
    <Card 
      ref={ref} 
      backgroundImage={backgroundimage || BackgroundPreseason}
      backgroundClassName="absolute inset-0 bg-center opacity-30"
      {...props}
    />
  );
});

DataLabCard.displayName = "DataLabCard";

export default DataLabCard; 