import { Radiation } from "lucide-react";
import { ToxicRiver, Award } from "@img/index";

export const GAME_MAPS = {
  toxic_river: { icon: ToxicRiver, alt: "Toxic River", label: "Toxic River" },
  award: { icon: Award, alt: "Award", label: "Award" },
  radiation_rift: {
    icon: () => <Radiation className="w-5 h-5 text-yellow-400" />,
    alt: "Radiation Rift",
    label: "Radiation Rift",
    isComponent: true,
  },
};

export default function MapIcon({ map }) {
  const mapData = GAME_MAPS[map];
  if (!mapData) return map;

  return (
    <div className="flex items-center justify-center gap-2">
      {mapData.isComponent ? (
        mapData.icon()
      ) : (
        <img src={mapData.icon} alt={mapData.alt} className="w-5 h-5" />
      )}
    </div>
  );
}

export function MapSelectItem({ map, mapData }) {
  return (
    <div className="flex items-center gap-2">
      {mapData.isComponent ? (
        mapData.icon()
      ) : (
        <img src={mapData.icon} alt={mapData.alt} className="w-5 h-5" />
      )}
      <span>{mapData.label}</span>
    </div>
  );
}
