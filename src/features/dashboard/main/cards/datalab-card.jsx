// src/features/dashboard/cards/DataLabCard.jsx
import React from "react";
import { Card } from "@ui/card";
import { DataLabBackground } from "@img/index";

export default function DataLabCard() {
  return (
    <Card
      title="DATA LAB"
      description="SIMULATE & IMPROVE"
      path="/dashboard/datalab"
      backgroundImage={DataLabBackground}
      backgroundClassName="bg-[length:auto_100%] bg-center"
      className="bg-[radial-gradient(at_center,_#000000_0%,_#161616_50%,_#212121_100%)] relative"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,_#212121_0%,_rgba(0,0,0,0)_49%,_#212121_100%),radial-gradient(60.23%_47.69%_at_36.76%_52.42%,_rgba(0,0,0,0)_5.5%,_rgba(22,22,22,0.5)_41%,_#212121_100%)] pointer-events-none" />
    </Card>
  );
}
