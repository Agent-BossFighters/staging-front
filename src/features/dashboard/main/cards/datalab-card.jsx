// src/features/dashboard/cards/DataLabCard.jsx
import React from "react";
import { Card } from "@ui/card";
import { BackgroundPreseason } from "@img/index";

export default function DataLabCard(props) {
  return (
    <Card 
      backgroundImage={BackgroundPreseason}
      backgroundClassName="opacity-30"
      {...props}
    />
  );
}
