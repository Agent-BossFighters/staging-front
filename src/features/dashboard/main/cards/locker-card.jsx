// src/features/dashboard/cards/LockerCard.jsx
import React from "react";
import { Card } from "@ui/card";
import { Locker } from "@img/index";

export default function LockerCard() {
  return (
    <Card
      title="LOCKER"
      description="MANAGE YOUR TACTIC / ASSETS / BUILDS & DISCOUNTS"
      path="/dashboard/locker"
      pattern={Locker}
      patternClassName="w-[95%] h-[95%] object-contain mx-auto"
      backgroundClassName="opacity-10"
      className="bg-gradient-to-b from-[#212121] via-[#000000] to-[#212121]"
    />
  );
}
