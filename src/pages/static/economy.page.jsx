import { Economy } from "@img/index";

export default function EconomyPage() {
  return (
    <div className="w-5/6 mx-auto h-full">
      <h1 className="text-primary text-6xl font-bold ps-20 pt-9">
        ECONOMY MAP
      </h1>
      <div className="flex items-center justify-center h-full pb-9">
        <img src={Economy} alt="Economy" className="h-full object-fit" />
      </div>
    </div>
  );
}
