import { Win, Draw, Loss } from "@img/index";

export const GAME_RESULTS = {
  win: { icon: Win, alt: "Win", label: "Victory" },
  draw: { icon: Draw, alt: "Draw", label: "Draw" },
  loss: { icon: Loss, alt: "Loss", label: "Defeat" },
};

export default function ResultIcon({ result }) {
  const resultData = GAME_RESULTS[result];
  if (!resultData) return result;

  return (
    <div className="flex items-left justify-left gap-2">
      <img src={resultData.icon} alt={resultData.alt} className="w-5 h-5" />
    </div>
  );
}

export function ResultSelectItem({ result, resultData }) {
  return (
    <div className="flex items-left gap-2">
      <img src={resultData.icon} alt={resultData.alt} className="w-5 h-5" />
      <span>{resultData.label}</span>
    </div>
  );
}