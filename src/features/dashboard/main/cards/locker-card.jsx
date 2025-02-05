// src/features/dashboard/cards/LockerCard.jsx
import React from "react";
import { Card } from "@ui/card";
import { Locker } from "@img/index";

export default function LockerCard(props) {
  return (
    <Card 
      pattern={Locker}
      patternClassName="w-[95%] h-[95%]"
      backgroundClassName="opacity-10"
      {...props}
    />
  );
}
